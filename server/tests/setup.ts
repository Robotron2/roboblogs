import mongoose from 'mongoose';

beforeAll(async () => {
  const url = 'mongodb://localhost:27017/roboblogs_test';
  await mongoose.connect(url);
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
});
