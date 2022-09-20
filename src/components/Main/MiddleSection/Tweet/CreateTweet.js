import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useState} from 'react'
import {axiosInstance} from '../../../../axios'
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

export default function CreateTweet(props) {
  const {updateTweetsList} = props
  let [editorState, setEditorState] = useState(this)
  
  const onEditorStateChange = function(state) {
    setEditorState(state)
  }
  const _uploadImageCallBack = (file) =>{

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
  const handleTweetPost = async function() {
    let authorId, content, mentionnedPeople

    authorId = '32426ea3-68c2-4355-b8a6-bb6304a21a4a'
    content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    mentionnedPeople = []

    const data = {authorId, content, mentionnedPeople}
    const results = await axiosInstance.post(
      'http://localhost:8080/tweet',
      {
        data
      }
    )
    setEditorState(null)
    updateTweetsList(results.data)
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
        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'image'],
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        image: { uploadCallback: _uploadImageCallBack },

    }}
/>
  <button type="button" className="btn" onClick={handleTweetPost}>Tweeter</button>

    </div>
  )
}