import React from 'react'

const Notification = ({ style, message }) => {
  if (style === null || message === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

export default Notification