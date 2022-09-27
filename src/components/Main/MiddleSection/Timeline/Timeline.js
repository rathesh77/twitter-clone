import CreateTweet from '../Tweet/CreateTweet.js'
import ListTweets from '../Tweet/ListTweets.js'
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../../../../axios'
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../../../authContext.js';

export default function Timeline() {

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
        if (message.uid in seenTweets) {
          seenTweets[message.uid].push({ author, relationship })
        }
        else {
          seenTweets[message.uid] = [{ author, relationship }]
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
        for (let j = 0; j <seenTweets[tweets[i].tweetId].length; j++) {
          const item = {
            author: seenTweets[tweets[i].tweetId][j].author,
            relationship: seenTweets[tweets[i].tweetId][j].relationship
          }
          if (!tweets[i].userRelations) {
            tweets[i].userRelations = [item]
          } else
            tweets[i].userRelations.push(item)
        }
      }
    }
    setDeepTweets(tweets)
  }

  useEffect(() => {
    fetchDeepTweets()
  }, [search])
  return (
      <div>
        <CreateTweet updateTweetsList={updateTweetsList} />
        <ListTweets tweets={deepTweets} />
    </div>
  );
}
