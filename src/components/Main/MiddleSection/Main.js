import CreateTweet from './Tweet/CreateTweet.js'
import ListTweets from './Tweet/ListTweets.js'
import { Route, Routes, useLocation } from 'react-router-dom';
import Profile from './UserProfile/Profile.js';
import { useState } from 'react';
import { axiosInstance } from '../../../axios'
import { useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../../../authContext.js';
import ViewTweet from './Tweet/ViewTweet.js';
export default function MiddleSection() {

  const [deepTweets, setDeepTweets] = useState([])
  const { user } = useContext(AuthContext)
  const {search} = useLocation()

  const updateTweetsList = (data) => {
    const update = [...deepTweets]
    const { uid } = data
    update.unshift({
      tweetId: uid,
      ...data

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
    const tweets = []
    const seenTweets = {}
    for (const res of result.data) {
      if (!res._fields[0])
        continue
      const message = res._fields[2].properties
      let author = res._fields[0].properties
      const relationship = res._fields[1]
      if (relationship !== 'WROTE_TWEET') {
        seenTweets[message.uid] = { author, relationship }

        if (message.uid in seenTweets)
          author = seenTweets[message.uid]
        else {
          author = (await axiosInstance.get(`/tweet-author?id=${message.uid}`))
          author = author.data._fields[0].properties
        }
        continue
      }
      tweets.push({
        tweetId: message.uid,
        author,
        ...message
      })
    }
    for (let i = 0; i < tweets.length; i++) {
      if (seenTweets[tweets[i].tweetId]) {
        const item = {
          author: seenTweets[tweets[i].tweetId].author,
          relationship: seenTweets[tweets[i].tweetId].relationship
        }
        if (!tweets[i].userRelations) {
          tweets[i].userRelations = [item]
        } else
          tweets[i].userRelations.push(item)
      }
    }

    setDeepTweets(tweets)
  }

  useEffect(() => {
    fetchDeepTweets()
  }, [search])
  return (
    <div className='middle-section'>
      <Routes>
        <Route path='/tweet' element={<ViewTweet key={search} />} />

        <Route path='/' element={<div><CreateTweet updateTweetsList={updateTweetsList} /><ListTweets tweets={deepTweets} /></div>} />
        <Route path='/profil' element={<Profile />} />

      </Routes>

    </div>
  );
}
