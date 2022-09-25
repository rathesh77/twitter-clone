import { useState, useEffect, useContext } from 'react'
import Banner from './Banner'
import { Tabs, Tab } from '@mui/material'
import UserInfos from './UserInfos'
import ListTweets from '../Tweet/ListTweets'
import {axiosInstance} from '../../../../axios'
import {Avatar} from '@mui/material'
import AuthContext from '../../../../authContext'
import { useLocation } from 'react-router-dom'

export default function Profile(props) {
  const tweets = [
   /* {
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    }
   */
  ]
  const { state } = useLocation();
  const [value, setValue] = useState(0)
  const [userTweets, setUserTweets ] = useState(tweets)
  const [user, setUser] = useState(null)
  const authContext = useContext(AuthContext)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=> {
    (async () => {
      const currentUser = (await axiosInstance.get(`/user?id=${state == null ? authContext.user.uid : state.userId}`)).data._fields[0].properties
      setUser(currentUser)
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
    content = (<ListTweets tweets={userTweets}/>)
  
  return (
    <div className='user-profile'>
      <Banner />
              <Avatar  sx={{ marginLeft: "10px", width: "25%", height:"auto" }} src={user.avatar} alt='profile pic'/>

      <UserInfos />
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
