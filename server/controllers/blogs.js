const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { body, user } = request;

  // eslint-disable-next-line no-prototype-builtins
  if (body.hasOwnProperty('title') && body.hasOwnProperty('url')) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await User.findByIdAndUpdate(user._id, user);

    response.status(201).json(savedBlog);
  } else {
    response.status(400).end();
  }
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const { user } = request;

    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== user._id.toString()) {
      response.status(401).json({ error: 'unauthorized delete' });
    } else {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    }
  }
);

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  response.json(updatedBlog);
});

blogsRouter.put('/:id/comments', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;
