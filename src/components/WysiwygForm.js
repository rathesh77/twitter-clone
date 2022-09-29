
import { useContext, useRef, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import AuthContext from "../authContext";
import { axiosInstance } from "../axios";

export default function WysiwygForm(props) {

  const [filePreview, setFilePreview] = useState(null)
  const [file, setFile] = useState(null)
  const [formContent, setFormContent] = useState(null)
  const { action, tweet } = props
  const authContext = useContext(AuthContext)
  

  const editor = useRef(null)
  const onEditorStateChange = function (e) {
    const state = e.target.value
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

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const response = await axiosInstance.post('/media', formData, config);
    return response.data
  }

  const handleTweetPost = async function () {
    let authorId, mentionnedPeople
    authorId = authContext.user.uid
    mentionnedPeople = []

    if (file == null && (formContent == null || formContent.trim().length === 0))
      return

    const filename = await uploadImage(file)
    let content = formContent == null ? '' : formContent.trim()

    if (file !== null) {
      const imageUrl = axiosInstance.defaults.baseURL + '/' + filename.filename
      const mimeType = filename.mimetype
      content += '<br/>'
      if (mimeType.toLowerCase().includes('video')) {
        content += `<video onclick="event.stopPropagation()" controls muted> <source src="${imageUrl}" type="${mimeType}"/> </video>`

      } else {

        content += `<img src="${imageUrl}" alt="test"/>`
      }
    }
    console.log(content)
    const data = { authorId, content, mentionnedPeople }
    if (tweet != null) {
      data['tweetId'] = tweet.uid
    }
    const results = await axiosInstance.post(
      '/tweet',
      {
        data
      }
    )
    console.log(results)
    await action(results.data)
    setFile(null)
    setFilePreview(null)
    setFormContent(null)
    editor.current.innerText = ''

  }

  return (
    <div className="tweet-editor">

      <div className="editor-wrapper">
        <textarea placeholder="Ecrivez votre tweet" className="editor" onChange={onEditorStateChange} ref={editor}>
        </textarea>
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