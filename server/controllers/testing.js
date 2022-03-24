const testingRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');

const addUser = async (newUserInfo) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUserInfo.password, saltRounds);

  const newUser = new User({
    ...newUserInfo,
    password: passwordHash,
  });

  return await newUser.save();
};

const addBlog = async (newBlogInfo) => {
  const newBlog = new Blog(newBlogInfo);

  return await newBlog.save();
};

testingRouter.post('/reset', async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const newUser = await addUser({
    username: 'martin231',
    name: 'Robert C. Martin',
    password: '123456789',
  });

  await addBlog({
    title: 'Test title 1',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture...',
    likes: 41,
    user: newUser._id,
  });

  await addBlog({
    title: 'Test title 2',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 15,
    user: newUser._id,
  });

  response.status(204).end();
});

module.exports = testingRouter;
