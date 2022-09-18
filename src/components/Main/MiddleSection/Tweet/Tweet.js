import { useState } from "react"
import { Avatar } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IosShareIcon from '@mui/icons-material/IosShare';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function Tweet(props) {
  const [message] = useState(props.message)
  const [author] = useState(props.author)
  const [timestamp] = useState(props.timestamp)

  return (
    <div className="tweet-wrapper">

      <div className="tweet-author-avatar">
        <Avatar src={author.avatar} alt={author.name} />
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
        <div className="tweet-message" dangerouslySetInnerHTML={{__html:message}}>
        </div>
        <div className="tweet-buttons">
          <ChatBubbleOutlineIcon/>
          <AutorenewIcon/>
          <FavoriteIcon/>
          <IosShareIcon/>
        </div>
      </div>
    </div>
  )
}