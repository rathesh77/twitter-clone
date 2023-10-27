import CreateTweet from '../../../components/form/CreateTweet'
import ListTweets from '../../../components/List/ListTweets'
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../../authContext.js';
import { fetchDeepTweets } from '../../../services/tweetServices';

export default function Timeline() {

  const [deepTweets, setDeepTweets] = useState([])
  const { user } = useContext(AuthContext)
  const {search} = useLocation()

  const updateTweetsList = (data) => {
    const update = [...deepTweets]
    update.unshift({
      ...data
    })
    setDeepTweets(update)
  }

  const getDeepTweets = async () => {
    const userId = user.uid
    const results = await fetchDeepTweets(userId)
    const tweets = []
    const seenTweets = {}
    for (const res of results) {
      if (!res)
        continue
      const message = res.tweet
      let author = res.user
      const relationship = res.relation
      if (relationship === 'RETWEETED') {
        if (message.uid in seenTweets) {
          seenTweets[message.uid].push({ author, relationship })
        }
        else {
          seenTweets[message.uid] = [{ author, relationship }]
        }
        continue
      }
      if (relationship === 'WROTE_TWEET')
      tweets.push(res)
    }

    for (let i = 0; i < results.length; i++) {
      if (seenTweets[results[i].tweet.uid] && results[i].relation == 'WROTE_TWEET') {
        const tweet = tweets.find((t) => t.tweet.uid === results[i].tweet.uid)
        for (let j = 0; j <seenTweets[results[i].tweet.uid].length; j++) {
          const item = {
            author: seenTweets[results[i].tweet.uid][j].author,
            relationship: seenTweets[results[i].tweet.uid][j].relationship
          }
          if (!tweet.userRelations) {
            tweet.userRelations = [item]
          } else
          tweet.userRelations.push(item)
        }
      }
    }
    setDeepTweets(tweets)
  }

  useEffect(() => {
    getDeepTweets()
  }, [search])
  return (
      <div>
        <CreateTweet updateTweetsList={updateTweetsList} />
        <ListTweets tweets={deepTweets} />
    </div>
  );
}
