import { List, ListItem } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../../authContext';
import { axiosInstance } from '../../../../axios';
import Tweet from './Tweet';

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

export default function ViewTweet() {

  const [tweet, setTweet] = useState(null)
  const [messages, setMessages] = useState(null)
  let [editorState, setEditorState] = useState(this)

  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  const onEditorStateChange = function (state) {
    setEditorState(state)
  }

  const updateMessagesList = function (data) {
    const newMessagesList = [...messages]
    newMessagesList.unshift({ message: { ...data }, author: authContext.user })
    setMessages(newMessagesList)
  }

  const _uploadImageCallBack = (file) => {

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    }

    return new Promise(
      (resolve, reject) => {
        resolve({ data: { link: imageObject.localSrc } });
      }
    );
  }

  const handleMessagePost = async function () {
    let authorId, content, mentionnedPeople

    authorId = authContext.user.uid
    content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    mentionnedPeople = []

    const data = { authorId, content, mentionnedPeople, tweetId: tweet.uid }
    const results = await axiosInstance.post(
      '/tweet',
      {
        data
      }
    )
    setEditorState(null)
    setTweet({ ...tweet, replies: tweet.replies + 1 })
    updateMessagesList(results.data)

  }

  const getCurrentTweetAndMessages = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const tweetId = urlParams.get('id')
      let response = await axiosInstance.get(`/tweet/${tweetId}/messages`)
      const currentTweet = response.data.tweet._fields[0].properties
      let { messages } = response.data
      messages = messages.map((m) => { return { author: m._fields[0].properties, message: m._fields[1].properties } })

      const obj = { ...currentTweet, author: { ...authContext.user } }
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
      <div className="tweet-editor">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          placeholder="Tweetez votre reponse"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'image'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: { uploadCallback: _uploadImageCallBack },

          }}
        />
        <button type="button" className="btn" onClick={handleMessagePost}>Tweeter</button>

      </div>
      <List>
        {messages.map((m) => {
          const { author, message } = m
          return (
            <ListItem key={message.uid}>
              <Tweet {...message} author={author} />
            </ListItem>
          )
        })}
      </List>
    </div>
  );
}
