import React, { useState, useEffect } from 'react';
import loginService from './services/login';
import blogsService from './services/blogs';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import CreateForm from './components/CreateForm';
import Blog from './components/Blog';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
      const loggedInUser = JSON.parse(loggedInUserJSON);
      setUser(loggedInUser);
      blogsService.setToken(loggedInUser.token);
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      const getBlogs = async () => {
        const listOfBlogs = await blogsService.getAll();
        setBlogs(listOfBlogs.sort((a, b) => (a.likes > b.likes ? -1 : 1)));
      };
      getBlogs();
    } else {
      setBlogs([]);
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await loginService.login({
        username: username,
        password: password,
      });

      window.localStorage.setItem('loggedInUser', JSON.stringify(response));

      blogsService.setToken(response.token);

      setUser(response);

      setNotification('login successfully');
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      setUsername('');
      setPassword('');
    } catch (error) {
      setNotification('wrong username or password');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const addBlog = async (theBlog) => {
    try {
      const response = await blogsService.create(theBlog);

      setBlogs(
        blogs.concat(response).sort((a, b) => (a.likes > b.likes ? -1 : 1))
      );

      setNotification(
        `a new blog ${response.title} by ${
          response.author !== '' ? response.author : 'unknown author'
        } added successfully`
      );
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      setNotification('missing title and/or url');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const updateLike = async (theBlog) => {
    try {
      const response = await blogsService.update(theBlog);

      const index = blogs.findIndex((blog) => blog.id === response.id);
      blogs[index].likes = response.likes;

      setBlogs(blogs.concat().sort((a, b) => (a.likes > b.likes ? -1 : 1)));
    } catch (error) {
      setNotification(error.message);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const deleteBlog = async (theBlog) => {
    try {
      if (
        window.confirm(
          `delete blog ${theBlog.title} by ${
            theBlog.author !== '' ? theBlog.author : 'unknown author'
          }`
        )
      ) {
        await blogsService.remove(theBlog);

        const index = blogs.findIndex((blog) => blog.id === theBlog.id);
        const tempBlogs = blogs.concat();
        tempBlogs.splice(index, 1);

        setBlogs(tempBlogs);

        setNotification(
          `blog ${theBlog.title} by ${
            theBlog.author !== '' ? theBlog.author : 'unknown author'
          } deleted successfully`
        );
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }
    } catch (error) {
      setNotification(error.message);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div>
      {user !== null ? (
        <div>
          <h1>blogs</h1>
          <Notification message={notification} />
          {user.name} logged in{' '}
          <button id='logout' onClick={handleLogout}>
            logout
          </button>
          <Togglable buttonLabel='create new blog'>
            <CreateForm addBlog={addBlog} />
          </Togglable>
          <div id='listOfBlogs'>
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLike={updateLike}
                deleteBlog={deleteBlog}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1>login to application</h1>
          <Notification message={notification} />
          <form id='loginForm' onSubmit={handleLogin}>
            username{' '}
            <input
              id='username'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />{' '}
            <br />
            password{' '}
            <input
              id='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />{' '}
            <br />
            <button id='login' type='submit'>
              login
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
