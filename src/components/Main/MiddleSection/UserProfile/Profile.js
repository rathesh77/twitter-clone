import { useState, useEffect, useContext } from 'react'
import { Tabs, Tab } from '@mui/material'
import UserInfos from './UserInfos'
import ListTweets from '../Tweet/ListTweets'
import { axiosInstance } from '../../../../axios'
import { Avatar } from '@mui/material'
import AuthContext from '../../../../authContext'
import { useLocation } from 'react-router-dom'

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
  const [isFollowing, setIsFollowing] = useState(null)
  const authContext = useContext(AuthContext)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleUserFollow = async () => {
    try {
      await axiosInstance.put(`/follow/${user.uid}`)
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
      const currentUser = (await axiosInstance.get(`/user?id=${state == null ? authContext.user.uid : state.userId}`)).data._fields[0].properties
      setUser(currentUser)
      if (currentUser.uid !== authContext.uid) {
        const following = await axiosInstance.get(`/follow/${currentUser.uid}`)
        const relation = following.data

        if (relation !== false) {
          setIsFollowing(true)
        } else {
          setIsFollowing(false)

        }
      }
      const userId = currentUser.uid
      const result = await axiosInstance.get(
        `/my-related-tweets?userId=${userId}`,
        {
          data: {
            userId
          }
        }
      )
      const tweets = []
      for (const res of result.data) {
        if (res._fields[1] === 'RETWEETED')
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
  if (user == null || isFollowing === null) {
    return (<div>LOADING</div>)
  }
  let content = 0

  if (value === 0)
    content = (<ListTweets tweets={userTweets} />)
  return (
    <div className='user-profile'>
      <div className='user-banner'>
        <div className="user-profile-pic"></div>
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
