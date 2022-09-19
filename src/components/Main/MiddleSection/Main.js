import CreateTweet from './Tweet/CreateTweet.js'
import ListTweets from './Tweet/ListTweets.js'
import { Route, Routes} from 'react-router-dom';
import Profile from './UserProfile/Profile.js';
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';

export default function MiddleSection() {

  const [deepTweets, setDeepTweets] = useState([])
  const updateTweetsList = (data) => {
    console.log(data)
    const update = [...deepTweets]
    update.unshift({
      author: {
        name: data.author.username,
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: data.content
    })
    setDeepTweets(update)
  }

  const fetchDeepTweets = async () => {
    const userId = '10d8b2ac-b2b3-444f-a177-c432e5efc568'
    const result = await axios.get(
      `http://localhost:8080/deep-tweets?userId=${userId}`,
      {
        data: {
          userId
        }
      }
    )
    const messages = []
    for (const res of result.data) {
      const message = res._fields[2].properties
      const author = res._fields[0].properties
      console.log(res)
      messages.push({
        author: {
          name: author.username,
          avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
        },
        message: message.content
      })
    }
    setDeepTweets(messages)
  }

  useEffect(()=>{
    fetchDeepTweets()
    console.log('tutu')
  }, [])
  return (
    <div className='middle-section'>
      <Routes>
        <Route path='/' element={<div><CreateTweet updateTweetsList={updateTweetsList}/><ListTweets messages={deepTweets}/></div>}/>
        <Route path='/profil' element={<Profile/>}/>
      </Routes>

      </div>
  );
}
