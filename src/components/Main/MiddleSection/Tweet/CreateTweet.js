import {useContext} from 'react'
import {axiosInstance} from '../../../../axios'
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import AuthContext from "../../../../authContext";
import WysiwygForm from "../../../WysiwygForm";

export default function CreateTweet(props) {
  const {updateTweetsList} = props
  const authContext = useContext(AuthContext)
  const {user} = authContext  
  let formContent = null

  const setFormContent = (data) => {
    formContent = data
  }

  const handleTweetPost = async function() {
    let authorId, content, mentionnedPeople
    if (formContent == null )
      return

    const editorCurrentContent = formContent.getCurrentContent()
    /*if (editorCurrentContent.getPlainText().trim().length === 0) {
      return
    }*/
    authorId = user.uid
    content = draftToHtml(convertToRaw(editorCurrentContent))
    if  (content.length === 0)
      return
    mentionnedPeople = []

    const data = {authorId, content, mentionnedPeople}
    const results = await axiosInstance.post(
      '/tweet',
      {
        data
      }
    )
    setFormContent(null)
    updateTweetsList(results.data)
  }
  return (
    <WysiwygForm setFormContent={setFormContent} action={handleTweetPost}/>
  )
}