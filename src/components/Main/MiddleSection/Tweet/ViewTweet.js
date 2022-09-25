import { List, ListItem } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../../authContext';
import { axiosInstance } from '../../../../axios';
import Tweet from './Tweet';

import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import WysiwygForm from '../../../WysiwygForm';

export default function ViewTweet() {

  const [tweet, setTweet] = useState(null)
  const [messages, setMessages] = useState(null)
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()


  const handleTweetClick = (e, tweetId) => {
    navigate(`/tweet?id=${tweetId}`)
  }

  let formContent = null

  const setFormContent = (data) => {
    formContent = data
  }

  const updateMessagesList = function (data) {
    const newMessagesList = [...messages]
    newMessagesList.unshift({ message: { ...data }, author: authContext.user })
    setMessages(newMessagesList)
  }

  const handleMessagePost = async function () {
    let authorId, content, mentionnedPeople

    if (formContent == null )
      return
    authorId = authContext.user.uid
    content = draftToHtml(convertToRaw(formContent.getCurrentContent()))
    mentionnedPeople = []

    const data = { authorId, content, mentionnedPeople, tweetId: tweet.uid }
    const results = await axiosInstance.post(
      '/tweet',
      {
        data
      }
    )
    setFormContent(null)
    setTweet({ ...tweet, replies: tweet.replies + 1 })
    updateMessagesList(results.data)

  }

  const getCurrentTweetAndMessages = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const tweetId = urlParams.get('id')
      let response = await axiosInstance.get(`/tweet/${tweetId}/messages`)
      const currentTweet = response.data.tweet._fields[0].properties
      const author = response.data.tweet._fields[1].properties
      let { messages } = response.data
      messages = messages.map((m) => { return { author: m._fields[0].properties, message: m._fields[1].properties } })

      const obj = { ...currentTweet, author }
      setTweet(obj)
      setMessages(messages)
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
      <Tweet key={tweet.replies} {...tweet}/>
        <WysiwygForm setFormContent={setFormContent} action={handleMessagePost}/>
      <List>
        {messages.map((m) => {
          const { author, message } = m
          return (
            <ListItem key={message.uid}  onClick={(e)=> {handleTweetClick(e, message.uid)}}>
              <Tweet {...message} author={author}/>
            </ListItem>
          )
        })}
      </List>
    </div>
  );
}
