import { useState, useEffect } from 'react'
import Banner from './Banner'
import { Tabs, Tab } from '@mui/material'
import UserInfos from './UserInfos'
import ListTweets from '../Tweet/ListTweets'
import {axiosInstance} from '../../../../axios'
import AuthContext from '../../../../authContext'
import { useContext } from 'react'
import {Avatar} from '@mui/material'

export default function Profile() {
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
  const [value, setValue] = useState(0)
  const [userTweets, setUserTweets ] = useState(tweets)
  const {user} = useContext(AuthContext)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchUserTweets = async () => {
    const userId = user.uid
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
  }

  useEffect(()=> {
    fetchUserTweets()
  }, [])
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
