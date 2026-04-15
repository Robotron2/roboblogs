import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/user.model';
import { generateAccessToken } from '../src/utils/jwt.utils';

describe('Post API', () => {
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  
  const postPayload = {
    title: 'Test Post Title',
    content: 'This is the test post content',
  };

  beforeEach(async () => {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    adminId = admin._id.toString();
    adminToken = generateAccessToken(adminId);

    const user = await User.create({
      name: 'User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });
    userToken = generateAccessToken(user._id.toString());
  });

  describe('POST /api/v1/posts', () => {
    it('should allow admin to create a post', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(postPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(postPayload.title);
      expect(res.body.data.slug).toBe('test-post-title'); // slugify works
      expect(res.body.data.author.toString()).toBe(adminId);
    });

    it('should reject non-admin from creating a post', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send(postPayload);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('You do not have permission to perform this action');
    });
  });

  describe('GET /api/v1/posts', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'First Post', content: 'hello world' });
      await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Second Post', content: 'test string' });
    });

    it('should fetch all posts', async () => {
      const res = await request(app).get('/api/v1/posts');
      expect(res.status).toBe(200);
      expect(res.body.data.posts.length).toBe(2);
      expect(res.body.data.total).toBe(2);
    });

    it('should support search functionality', async () => {
      const res = await request(app).get('/api/v1/posts?search=hello');
      expect(res.status).toBe(200);
      expect(res.body.data.posts.length).toBe(1);
      expect(res.body.data.posts[0].title).toBe('First Post');
    });
  });
});
