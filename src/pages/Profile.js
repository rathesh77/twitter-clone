import { useState, useEffect, useContext } from 'react'
import { Tabs, Tab } from '@mui/material'
import UserInfos from '../components/UserInfos'
import ListTweets from '../components/list/ListTweets'
import { Avatar } from '@mui/material'
import AuthContext from '../authContext'
import { useLocation } from 'react-router-dom'
import { fetchRelatedTweets } from '../services/tweetServices'
import { doesCurrentUserFollowRecipient, fetchFollowers, fetchFollowings, fetchUser, followUser } from '../services/userServices'

export default function Profile(props) {

  const tweets = [
    /* {
       author: {
         id: 0,
         name: '',
         avatar: ''
       },
       message: ``
     }
    */
  ]
  const { state } = useLocation();
  const [value, setValue] = useState(0)
  const [userTweets, setUserTweets] = useState(tweets)
  const [user, setUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const authContext = useContext(AuthContext)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleUserFollow = async () => {
    try {
      await followUser(user.uid)
      setIsFollowing(true)
    } catch (e) {
      console.log(e)
    }
  }

  const handleHoverFollowButton = (e) => {
    if (isFollowing === true)
      e.target.innerText = 'Se debasonner'
  }
  const handleUnhoverFollowButton = (e) => {
    if (isFollowing === true)
      e.target.innerText = 'Abonné'
  }

  useEffect(() => {
    (async () => {
      const currentUserId = state == null ? authContext.user.uid : state.userId
      const currentUser = await fetchUser(currentUserId)
      let followers = await fetchFollowers(currentUserId)

      let followings = await fetchFollowings(currentUserId)
      setUser({...currentUser, followers, followings})
      if (currentUser.uid !== authContext.user.uid ) {
        const isFollowing = await doesCurrentUserFollowRecipient(currentUser.uid)
        if (isFollowing !== false) {
          setIsFollowing(true)
        } else {
          setIsFollowing(false)

        }
      }
      const userId = currentUser.uid
      const results = await fetchRelatedTweets(userId)
      const tweets = []
      for (const res of results) {
        if (res._fields[1] !== 'WROTE_TWEET')
          continue
        const message = res._fields[0].properties
        const author = res._fields[2].properties
        tweets.push({
          author,
          ...message

        })
      }
      setUserTweets(tweets)
    })()
  }, [state])
  if (user == null) {
    return (<div>LOADING</div>)
  }
  let content = 0

  if (value === 0)
    content = (<ListTweets tweets={userTweets} />)
  return (
    <div className='user-profile'>
      <div className='user-banner'>
        <div className="user-profile-pic" style={{backgroundImage: `url('${user.banner}')`}}></div>
        {user.uid === authContext.user.uid ? <button className='btn btn-edit-profile'>Éditer le profil</button> : null}
      </div>
      <div className='user-profile-avatar-wrapper'>
        <Avatar sx={{ width: "140px", height: "140px" }} src={user.avatar} alt='profile pic' />
        {user.uid !== authContext.user.uid ? <button onMouseEnter={handleHoverFollowButton} onMouseOut={handleUnhoverFollowButton} className='btn' onClick={handleUserFollow}>
          {isFollowing === true ? "Abonné" : 'Suivre'}
        </button> : null}
      </div>
      <UserInfos user={user}/>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Tweets" />
        <Tab label="Tweets et réponses" />
        <Tab label="Medias" />
        <Tab label="J'aime" />

      </Tabs>
      {content}
    </div>
  );
}
