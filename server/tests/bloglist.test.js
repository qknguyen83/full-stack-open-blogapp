const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');

const api = supertest(app);

beforeEach(async () => {
  jest.setTimeout(10000);
  await api.post('/api/testing/reset');
});

test('blogs are returned as json', async () => {
  const NUMBER_OF_POSTS = 2;

  const response = await api.get('/api/blogs');

  expect(response.status).toBe(200);
  expect(response.type).toBe('application/json');
  expect(response.body.length).toBe(NUMBER_OF_POSTS);
});

test('verifying id property', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test('http post without token', async () => {
  const blogsAtBegin = await api.get('/api/blogs');

  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Robert C. Martin',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 12,
  };

  await api.post('/api/blogs').send(newBlog).expect(401);

  const blogsAtEnd = await api.get('/api/blogs');
  expect(blogsAtEnd.body.length).toEqual(blogsAtBegin.body.length);
});

test('http post', async () => {
  const blogsAtBegin = await api.get('/api/blogs');

  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Robert C. Martin',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 12,
  };

  const user = await api
    .post('/api/login')
    .send({ username: 'martin231', password: '123456789' });

  const token = JSON.parse(user.text).token;

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await api.get('/api/blogs');
  expect(blogsAtEnd.body.length).toEqual(blogsAtBegin.body.length + 1);
});

test('missing likes', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Robert C. Martin',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  };

  const user = await api
    .post('/api/login')
    .send({ username: 'martin231', password: '123456789' });

  const token = JSON.parse(user.text).token;

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await api.get('/api/blogs');
  expect(blogsAtEnd.body[blogsAtEnd.body.length - 1].likes).toBe(0);
});

test('missing title and url', async () => {
  const blogsAtBegin = await api.get('/api/blogs');

  const newBlog = {
    author: 'Robert C. Martin',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 12,
  };

  const user = await api
    .post('/api/login')
    .send({ username: 'martin231', password: '123456789' });

  const token = JSON.parse(user.text).token;

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + token)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await api.get('/api/blogs');
  expect(blogsAtEnd.body.length).toBe(blogsAtBegin.body.length);
});

test('http delete', async () => {
  const blogsAtBegin = await api.get('/api/blogs');
  const ID = blogsAtBegin.body[blogsAtBegin.body.length - 1].id;

  const user = await api
    .post('/api/login')
    .send({ username: 'martin231', password: '123456789' });

  const token = JSON.parse(user.text).token;

  await api
    .delete(`/api/blogs/${ID}`)
    .set('Authorization', 'bearer ' + token)
    .expect(204);

  const blogsAtEnd = await api.get('/api/blogs');
  expect(blogsAtEnd.body.length).toBe(blogsAtBegin.body.length - 1);
});

test('http put', async () => {
  const update = { likes: 38 };

  const blogsAtBegin = await api.get('/api/blogs');
  const ID = blogsAtBegin.body[blogsAtBegin.body.length - 1].id;

  await api.put(`/api/blogs/${ID}`).send(update).expect(200);

  const blogsAtEnd = await api.get('/api/blogs');
  const updatedBlog = blogsAtEnd.body[blogsAtEnd.body.length - 1];

  expect(updatedBlog.likes).toBe(update.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
