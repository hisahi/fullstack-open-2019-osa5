import React from 'react'
import 'jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Blog from './Blog'

afterEach(cleanup)

test('Blog does not show everything right away', () => {
  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'http://example.com/',
    likes: 123,
    user: {
      name: 'test'
    }
  }

  const component = render(
    <Blog blog={blog} authUser={null} likeBlog={() => 0} deleteBlog={() => 0} />
  )

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(blog.likes.toString())

  fireEvent.click(component.getByText(new RegExp(blog.title)))

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes.toString())
})
