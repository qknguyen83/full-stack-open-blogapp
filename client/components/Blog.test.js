/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

let component;

const testBlog = {
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 14,
  user: {
    username: 'username231',
    name: 'Robert C. Martin',
    id: '61f78696a9398f0fc8e6158b',
  },
  id: '61f78759a9398f0fc8e61595',
};

const updateLike = jest.fn();
const deleteBlog = jest.fn();

beforeEach(() => {
  component = render(
    <Blog blog={testBlog} updateLike={updateLike} deleteBlog={deleteBlog} />
  );
});

test('blog does not render its url or likes by default', () => {
  expect(
    component.getByText(`${testBlog.title} by ${testBlog.author}`)
  ).not.toBe(null);
  expect(component.container.querySelector('.url')).toBe(null);
  expect(component.container.querySelector('.likes')).toBe(null);
  expect(component.container.querySelector('.addedBy')).toBe(null);
});

test('blog shows its url and likes when the view button has been clicked', () => {
  const button = component.getByText('view');
  fireEvent.click(button);

  expect(component.container.querySelector('.url')).not.toBe(null);
  expect(component.container.querySelector('.likes')).not.toBe(null);
  expect(component.container.querySelector('.addedBy')).not.toBe(null);
});

test('the like button is clicked twice', () => {
  const button = component.getByText('view');
  fireEvent.click(button);

  const likeButton = component.getByText('like');
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  expect(updateLike.mock.calls).toHaveLength(2);
});
