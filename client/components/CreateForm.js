import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CreateForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();

    const newBlog = {
      ...(title !== '' && { title: title }),
      ...(url !== '' && { url: url }),
      author: author,
    };

    addBlog(newBlog);

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h1>create new</h1>
      <form onSubmit={handleCreate}>
        title{' '}
        <input
          className='title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />{' '}
        <br />
        author{' '}
        <input
          className='author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />{' '}
        <br />
        url{' '}
        <input
          className='url'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />{' '}
        <br />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

CreateForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
};

export default CreateForm;
