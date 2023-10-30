import {Avatar} from '@mui/material'
import ClickableUser from "../components/ClickableUser"
import { followUser } from "../services/userServices"
export default function Suggestion(props) {
  
  const {updateSuggestions, user} = props
  const {username, avatar} = user
  const handleUserFollow = async () => {
    try {
      await followUser(user.uid)
      updateSuggestions(user.uid)
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
          <ClickableUser className="suggestion-user-name" user={user}>
            <div>
              {user.username}
            </div>
          </ClickableUser>
          <div className="suggestion-user-tag">@{username.split(' ').join('_')}</div>
        </div>
        <div className="btn btn-follow" onClick={handleUserFollow}>Suivre</div>
      </div>

    </div>
  )
}