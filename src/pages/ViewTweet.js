import { List, ListItem } from '@mui/material'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tweet from '../components/Tweet';
import WysiwygForm from '../components/form/WysiwygForm';
import { fetchTweetsUnderTweet, findTweetById } from '../services/tweetServices';
import TweetButton from '../components/buttons/TweetButton';
import { uploadTweet } from '../tools/tweet.tools';


export default function ViewTweet() {

  const [tweet, setTweet] = useState(null)
  const [messages, setMessages] = useState(null)
  const navigate = useNavigate()

  const handleTweetClick = (e, tweetId) => {
    navigate(`/tweet?id=${tweetId}`)
  }

  const updateTweetsList = function (tweet) {
    const newMessagesList = [...messages]
    newMessagesList.unshift(tweet)
    setMessages(newMessagesList)
  }


  const handleTweetPost = async function (formContent, file) {
    const createdTweet = await uploadTweet(formContent, file, tweet)
     await updateTweetsList(createdTweet)
   }

  const getCurrentTweetAndMessages = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const tweetId = urlParams.get('id')
      let response = await fetchTweetsUnderTweet(tweetId)
      const currentTweet = await findTweetById(tweetId)
      setTweet(currentTweet)
      setMessages(response)

    } catch (e) {
      console.log('une erreur est survenu:', e)
      navigate('/')
    }
  }

  useEffect(() => {
    if (tweet == null) 
      getCurrentTweetAndMessages()
  
  }, [tweet])
  
  if (tweet === null) {
    return <div>LOADING</div>
  }

  return (
    <div className="tweet">
      <Tweet key={tweet.tweet.replies} {...tweet}/>
        <WysiwygForm action={handleTweetPost} placeholder="Ecrivez votre tweet" button={<TweetButton />}/>
      <List>
        {messages.map((m) => {
          const { tweet } = m
          return (
            <ListItem key={tweet.uid}  onClick={(e)=> {handleTweetClick(e, tweet.uid)}}>
              <Tweet {...m}/>
            </ListItem>
          )
        })}
      </List>
    </div>
  );
}
