import { useContext } from 'react'
import { axiosInstance } from '../../../../axios'
import AuthContext from "../../../../authContext";
import WysiwygForm from "../../../WysiwygForm";

export default function CreateTweet(props) {
  const { updateTweetsList } = props
  const authContext = useContext(AuthContext)
  const { user } = authContext
  let formContent = null

  const setFormContent = (data) => {
    formContent = data
  }

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const response = await axiosInstance.post('/chunks', formData, config);
    return response.data
  }

  const handleTweetPost = async function (file) {
    let authorId, mentionnedPeople
    authorId = user.uid
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
    <WysiwygForm setFormContent={setFormContent} action={handleTweetPost} />
  )
}