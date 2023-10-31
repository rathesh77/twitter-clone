
import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ImageIcon from '@mui/icons-material/Image';

const style = {
  'editor': {
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderCollapse: 'collapse',
    padding: '10px 16px 10px 16px',
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minHeight: '120px'
  },
  'textField': {
    attributes: {
      variant: 'standard'
    }
  }
}
export default function WysiwygForm(props) {

  const [filePreview, setFilePreview] = useState(null)
  const [file, setFile] = useState(null)
  const [fileErr, setFileErr] = useState(false)

  const [formContent, setFormContent] = useState('')
  const action = props.action == null ? () => { } : props.action
  const { placeholder, emitWritingEvent } = props

  
  const onEditorStateChange = function (e) {
    const state = e.target.value
    setFormContent(state)
    if (emitWritingEvent)
    emitWritingEvent()
  }


  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    const sizeMB = file.size / (10 ** 6)
    if (sizeMB > 50) {
      setFileErr(true)
      setTimeout(() => {
        setFileErr(false)
      }, 3000)
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
  const styleSelector = props.style == null ? style : props.style
  return (
    <div style={styleSelector['editor']}>
      {fileErr === true ?
        <div className="file-error">
          File must not exceed 50MB
        </div>
        : null}

      <div className="editor-wrapper">

        <TextField
          id="multiline-flexible"
          label={placeholder}
          className="editor"
          multiline
          maxRows={10}
          value={formContent}
          onChange={onEditorStateChange}
          variant={styleSelector['textField']['attributes']['variant']}
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