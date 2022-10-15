
import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ImageIcon from '@mui/icons-material/Image';

const BASE_URL = axiosInstance.defaults.baseURL
export default function WysiwygForm(props) {

  const [filePreview, setFilePreview] = useState(null)
  const [file, setFile] = useState(null)
  const [fileErr, setFileErr] = useState(false)

  const [formContent, setFormContent] = useState('')
  const action = props.action == null ? () => { } : props.action
  const { action, tweet } = props
  const authContext = useContext(AuthContext)
  
  const onEditorStateChange = function (e) {
    const state = e.target.value
    setFormContent(state)
  }


  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    const sizeMB = file.size / (10**6)
    if (sizeMB > 512.0) {
      setFileErr(true)
      setTimeout(()=>{
        setFileErr(false)
      },3000)
      return
    }
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


  const submitForm = async function () {
    await action(formContent, file)
    setFile(null)
    setFilePreview(null)
    setFormContent('')


  }

  return (
    <div className="tweet-editor">
      { fileErr === true ? 
        <div className="file-error">
          File must not exceed 512MB
        </div>
      : null}

      <div className="editor-wrapper">
        
        <TextField
          id="multiline-flexible"
          label="Ecrivez votre tweet"
          className="editor"
          multiline
          maxRows={10}
          value={formContent}
          onChange={onEditorStateChange}
          variant="standard"
        />
        <div className="file-preview" dangerouslySetInnerHTML={{ __html: filePreview }} >

        </div>
        <div className="editor-buttons">
          <IconButton color='inherit' aria-label="upload picture" component="label">
            <input id="selectedFile" hidden type="file" multiple={false} onChange={handleFileUpload} />
            <ImageIcon />
          </IconButton>
        </div>
      </div>
      <div onClick={submitForm}>
        {props.button}
      </div>
    </div>
  )
}