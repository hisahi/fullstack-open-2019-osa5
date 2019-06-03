import React, { useState } from 'react'

const Blog = ({ blog, authUser, likeBlog, deleteBlog }) => {
  const [showFull, setShowFull] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (showFull) {
    return (
      <div style={blogStyle}>
        <div onClick={() => (setShowFull(!showFull))}>
          <p>{blog.title} by {blog.author}</p>
          <p><a href={blog.url}>{blog.url}</a></p>
          <p>{blog.likes} likes <button type="button" onClick={likeBlog}>like</button></p>
          <p>added by {blog.user.name}</p>
          { authUser !== null && blog.user.username === authUser.username &&
            <p><button type="button" onClick={deleteBlog}>delete</button></p> }
        </div>
      </div>)
  } else {
    return (
      <div style={blogStyle}>
        <div onClick={() => (setShowFull(!showFull))}>
          {blog.title} by {blog.author}
        </div>
      </div>)
  }
}

export default Blog