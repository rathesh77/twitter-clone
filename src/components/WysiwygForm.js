
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function WysiwygForm(props) {

  let [editorState, setEditorState] = useState(this)
  const {setFormContent, action} = props
  const onEditorStateChange = function (state) {
    setEditorState(state)
   setFormContent(state)
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

  return (
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
        <button type="button" className="btn" onClick={()=>{action(); setEditorState(null)}}>Tweeter</button>
          </div>
  )
}