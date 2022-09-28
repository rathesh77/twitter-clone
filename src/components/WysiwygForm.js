
import { useRef, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function WysiwygForm(props) {

  let [setEditorState] = useState(this)
  const [filePreview, setFilePreview] = useState(null)
  const [file, setFile] = useState(null)
  const { action, setFormContent } = props

  const editor = useRef(null)
  const onEditorStateChange = function (e) {
    const state = e.target.innerText
    setEditorState(state)
    setFormContent(state)
  }


  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setFile(file)
    const objectURL = URL.createObjectURL(file);
    const mimeType = file.type
    let content = ''
    if (mimeType.toLowerCase().includes('video')) {
      content = `<video onclick="event.stopPropagation()" controls muted> <source src="${objectURL}" type="${mimeType}"/> </video>`
    } else {
      content = `<img src="${objectURL}" alt="test"/>`
    }
    setFilePreview(content)
  }

  const handleTweetPost = async () => {
    await action(file);
    setEditorState(null);
    setFile(null)
    setFilePreview(null)
    setFormContent(null)
    editor.current.innerText = ''
  }
  return (
    <div className="tweet-editor">

      <div className="editor-wrapper">
        <div contentEditable="true" className="editor" onInput={onEditorStateChange} ref={editor}>
        </div>
        <div className="file-preview" dangerouslySetInnerHTML={{ __html: filePreview }}>

        </div>
        <div className="editor-buttons">
          <input id="selectedFile" style={{ "display": "none", width: 'inherit' }} type="file" multiple={false} onChange={handleFileUpload} /><button type="button" onClick={(e) => { document.getElementById('selectedFile').click() }}>Upload file</button>
        </div>
      </div>
      <button type="button" className="btn" onClick={handleTweetPost}>Tweeter</button>
    </div>
  )
}