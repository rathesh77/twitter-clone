import { useState } from "react"
import { Avatar } from '@mui/material'
export default function Tweet(props) {
  const [message] = useState(props.message)
  const [author] = useState(props.author)
  const [timestamp] = useState(props.timestamp)

  return (
    <div className="tweet-wrapper">
      <div className="tweet-author-avatar">
      <Avatar src={author.avatar} alt={author.name}/>

      </div>
      <div className="tweet-content">
        <div className="tweet-header">
          <div className="tweet-author-name">
            {author.name}
          </div>
          <div className="tweet-author-tag">
            @{author.name}
          </div>
          <div className="tweet-timestamp">
            {timestamp}
          </div>
        </div>
        <div className="tweet-message">
          {message}
        </div>
      </div>
    </div>
  )
}