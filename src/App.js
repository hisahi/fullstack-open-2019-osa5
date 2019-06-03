import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useField } from './hooks'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorStyle, setErrorStyle] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const username = useField('text')
  const password = useField('text')
  const newBlogTitle = useField('text')
  const newBlogAuthor = useField('text')
  const newBlogUrl = useField('url')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const showNotification = (style, message) => {
    setErrorStyle(style)
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(user))
      setUser(user)
      username.reset()
      password.reset()
    } catch (exception) {
      showNotification('error', 'incorrect username or password')
    }
  }

  const logOut = () => {
    window.localStorage.clear()
    blogService.setToken(null)
    setUser(null)
  }

  const updateBlogs = async () => {
    const blogs = await blogService.getAll()
    blogs.sort((blog1, blog2) => blog2.likes - blog1.likes)
    setBlogs(blogs)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const blog = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }

      const response = await blogService.create(blog)
      showNotification('success', `new blog ${response.title} added`)
      newBlogTitle.reset()
      newBlogAuthor.reset()
      newBlogUrl.reset()
      await updateBlogs()
    } catch (exception) {
      showNotification('error', 'could not add blog')
    }
  }

  const handleLike = async (event, blog) => {
    event.stopPropagation()
    try {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      }

      const response = await blogService.update(newBlog)
      showNotification('success', `blog ${response.title} liked`)
      updateBlogs()
    } catch (exception) {
      showNotification('error', 'could not like blog')
    }
  }

  const handleDelete = async (event, blog) => {
    event.stopPropagation()
    try {
      if (window.confirm(`Do you want to delete the blog ${blog.title}?`)) {
        await blogService.remove(blog)
        showNotification('success', `blog ${blog.title} deleted`)
        updateBlogs()
      }
    } catch (exception) {
      showNotification('error', 'could not delete blog')
    }
  }

  useEffect(() => {
    updateBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <div>
      {!loginVisible &&
        <button onClick={() => setLoginVisible(true)}>log in</button>}
      {loginVisible &&
        <>
          <LoginForm handleSubmit={handleLogin} username={username} password={password} />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </>}
    </div>
  )

  const loggedIn = () => (
    <>
      <div>
        <p>{user.name} ({user.username}) logged in</p>
        <button type="button" onClick={logOut}>log out</button>
      </div>
      <div>
        <h2>new blog</h2>
        <div>
          <form onSubmit={handleCreate}>
            <div>
              title
              <input required name="Title" {...newBlogTitle} reset={null} />
            </div>
            <div>
              author
              <input required name="Author" {...newBlogAuthor} reset={null} />
            </div>
            <div>
              URL
              <input required name="URL" {...newBlogUrl} reset={null} />
            </div>
            <button type="submit">add</button>
          </form>
        </div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} authUser={user}
            likeBlog={(e) => handleLike(e, blog)} deleteBlog={(e) => handleDelete(e, blog)} />
        )}
      </div>
    </>
  )

  return (
    <div>
      <Notification style={errorStyle} message={errorMessage} />
      { user === null ? loginForm() : loggedIn() }
    </div>
  )
}

export default App
