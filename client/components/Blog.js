import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateLike, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    updateLike(newBlog);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className='blog' style={blogStyle}>
      <p>
        {`${blog.title} by ${blog.author}`}{' '}
        <button className='view' onClick={toggleShowDetails}>
          {showDetails === false ? 'view' : 'hide'}
        </button>
      </p>
      {showDetails === true ? (
        <div>
          <p className='url'>url: {blog.url}</p>
          <p className='likes'>
            likes: {blog.likes}{' '}
            <button className='like' onClick={handleLike}>
              like
            </button>
          </p>
          <p className='addedBy'>added by: {blog.user.name}</p>
          {blog.user !== undefined && blog.user.length !== 0 ? (
            <button className='delete' onClick={() => deleteBlog(blog)}>
              delete
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
