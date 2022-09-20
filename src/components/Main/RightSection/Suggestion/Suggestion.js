import { useState } from "react"
import {Avatar} from '@mui/material'
export default function Suggestion(props) {
  const [title] = useState(props.title)
  const [avatar] = useState(props.avatar)
  return (
    <div className="suggestion">
      <div className="suggestion-avatar">
        <Avatar src={avatar} alt={title}/>
      </div>
      <div className="suggestion-user-wrapper"  style={{display: 'flex', justifyContent: 'space-between'}}>
        <div className="suggestion-user">
          <div className="suggestion-user-name">{title}</div>
          <div className="suggestion-user-tag">@{title.split(' ').join('_')}</div>
        </div>
        <a href="test"><div className="btn btn-follow">Suivre</div></a>
      </div>

    </div>
  )
}