import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  const userPayload = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userPayload);

      if (res.status !== 201) console.log(res.body);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe(userPayload.email);
      expect(res.body.data).toHaveProperty('accessToken');
      
      // Password should not be returned
      expect(res.body.data.user).not.toHaveProperty('password');
      
      // Refresh token should be in a cookie
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/refreshToken=/);
      expect(cookies[0]).toMatch(/HttpOnly/);
    });

    it('should fail if email is already taken', async () => {
      await request(app).post('/api/v1/auth/register').send(userPayload);
      
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User already exists');
    });

    it('should fail with invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...userPayload, email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email format');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(userPayload);
    });

    it('should login returning access token and refresh cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userPayload.email, password: userPayload.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/refreshToken=/);
    });
    
    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userPayload.email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });
});
