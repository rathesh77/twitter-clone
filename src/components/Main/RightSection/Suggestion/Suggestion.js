import { useState } from "react"
import {Avatar} from '@mui/material'
import ClickableUser from "../../../ClickableUser"
import { followUser } from "../../../../services/User"
export default function Suggestion(props) {
  
  const {setSuggestions, user} = props
  const {username, avatar} = user
  const handleUserFollow = async () => {
    try {
      await followUser(user.uid)
      setSuggestions([])
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div className="suggestion">
      <div className="suggestion-avatar">
        <Avatar src={avatar} alt={username}/>
      </div>
      <div className="suggestion-user-wrapper"  style={{display: 'flex', justifyContent: 'space-between'}}>
        <div className="suggestion-user">
          <ClickableUser className="suggestion-user-name" user={user}/>
          <div className="suggestion-user-tag">@{username.split(' ').join('_')}</div>
        </div>
        <div className="btn btn-follow" onClick={handleUserFollow}>Suivre</div>
      </div>

    </div>
  )
}