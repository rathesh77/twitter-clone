import { List, ListItem } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../authContext';
import Tweet from '../components/Tweet';
import WysiwygForm from '../components/form/WysiwygForm';
import { fetchTweetsUnderTweet, postMedia, postTweet, findTweetById } from '../services/tweetServices';
import { axiosInstance } from '../axios';
import TweetButton from '../components/buttons/TweetButton';

const BASE_URL = axiosInstance.defaults.baseURL

export default function ViewTweet() {

  const [tweet, setTweet] = useState(null)
  const [messages, setMessages] = useState(null)
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  const handleTweetClick = (e, tweetId) => {
    navigate(`/tweet?id=${tweetId}`)
  }

  const updateTweetsList = function (tweet) {
    const newMessagesList = [...messages]
    newMessagesList.unshift(tweet)
    setMessages(newMessagesList)
  }

  const action = (tweet)=> {
    updateTweetsList(tweet)
  } 

  const uploadImage = async (file) => {
    return await postMedia(file)
  }

  const handleTweetPost = async function (formContent, file) {
    let userId, mentionnedPeople
    userId = authContext.user.uid
    mentionnedPeople = []

    if (file == null && (formContent == null || formContent.trim().length === 0))
      return

    const filename = await uploadImage(file)
    let content = formContent == null ? '' : formContent.trim()

    if (file !== null) {
      const imageUrl = BASE_URL + '/' + filename.filename
      const mimeType = filename.mimetype
      content += '<br/>'
      if (mimeType.toLowerCase().includes('video')) {
        content += `<video onclick="event.stopPropagation()" controls muted> <source src="${imageUrl}" type="${mimeType}"/> </video>`
      } else {
        content += `<img src="${imageUrl}" alt="test"/>`
      }
    }
    const data = { userId, content, mentionnedPeople }
    if (tweet != null) {
      data['masterTweetId'] = tweet.tweet.uid
    }
    const results = await postTweet(data)
    await action(results)
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
