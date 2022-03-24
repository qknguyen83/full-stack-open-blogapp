/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import CreateForm from './CreateForm';

const testBlog = {
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
};

test('<CreateForm/>', () => {
  const addBlog = jest.fn();

  const component = render(<CreateForm addBlog={addBlog} />);

  const title = component.container.querySelector('.title');
  const author = component.container.querySelector('.author');
  const url = component.container.querySelector('.url');
  const button = component.getByText('create');

  fireEvent.change(title, {
    target: { value: testBlog.title },
  });
  fireEvent.change(author, {
    target: { value: testBlog.author },
  });
  fireEvent.change(url, {
    target: { value: testBlog.url },
  });
  fireEvent.submit(button);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0]).toEqual(testBlog);
});
