import CreateTweet from './Tweet/CreateTweet.js'
import ListTweets from './Tweet/ListTweets.js'
import { Route, Routes } from 'react-router-dom';
import Profile from './UserProfile/Profile.js';
import { useState } from 'react';
import { axiosInstance } from '../../../axios'
import { useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../../../authContext.js';
export default function MiddleSection() {

  const [deepTweets, setDeepTweets] = useState([])
  const { user } = useContext(AuthContext)


  const updateTweetsList = (data) => {
    const update = [...deepTweets]
    update.unshift({
      author: {
        name: data.author.username,
        avatar: user.avatar
      },
      message: data.content
    })
    setDeepTweets(update)
  }

  const fetchDeepTweets = async () => {
    const userId = user.uid
    const result = await axiosInstance.get(
      `/deep-tweets?userId=${userId}`,
      {
        data: {
          userId
        }
      }
    )
    console.log(result.data)
    const messages = []
    const seenTweets = {}
    for (const res of result.data) {
      if (!res._fields[0])
        continue
      const message = res._fields[2].properties
      let author = res._fields[0].properties
      const relationship = res._fields[1]
      if (relationship != 'WROTE_TWEET') {
        seenTweets[message.uid] = { author, relationship }

        if (message.uid in seenTweets)
          author = seenTweets[message.uid]
        else {
          author = (await axiosInstance.get(`/tweet-author?id=${message.uid}`))
          author = author.data._fields[0].properties
        }
        continue
      }
      const likes = message.likes
      messages.push({
        tweetId: message.uid,
        author: {
          name: author.username,
          avatar: user.avatar,
        },
        message: message.content,
        likes,
        relationship
      })
    }
    for (let i = 0; i < messages.length; i++) {
      if (seenTweets[messages[i].tweetId]) {
        const item = {
          author: seenTweets[messages[i].tweetId].author,
          relationship: seenTweets[messages[i].tweetId].relationship
        }
        if (!messages[i].userRelations) {
          messages[i].userRelations = [item]
        } else
          messages[i].userRelations.push(item)
      }
    }
    console.log(messages)
    setDeepTweets(messages)
  }

  useEffect(() => {
    fetchDeepTweets()
  }, [])
  return (
    <div className='middle-section'>
      <Routes>
        <Route path='/' element={<div><CreateTweet updateTweetsList={updateTweetsList} /><ListTweets messages={deepTweets} /></div>} />
        <Route path='/profil' element={<Profile />} />
      </Routes>

    </div>
  );
}
