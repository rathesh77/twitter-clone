import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useState} from 'react'
import axios from 'axios'
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

export default function CreateTweet() {
  let [editorState, setEditorState] = useState(this)
  const onEditorStateChange = function(state) {
    setEditorState(state)
  }
  const handleTweetPost = async function() {
    let authorId, content, mentionnedPeople

    authorId = '3359fb73-fd65-42d7-a728-396ec3a6540f'
    content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    mentionnedPeople = []

    const data = {authorId, content, mentionnedPeople}
    
    await axios.post(
      'http://localhost:8080/tweet',
      {
        data
      }
    )
  }
  return (
    <div className="tweet-editor">
     <Editor
  editorState={editorState}
  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName"
  placeholder="Quoi de neuf ?"
  onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        
    }}
/>
  <button type="button" className="btn" onClick={handleTweetPost}>Tweeter</button>

    </div>
  )
}