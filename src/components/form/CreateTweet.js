import { useContext } from "react";
import AuthContext from "../../authContext";
import { axiosInstance } from "../../axios";
import WysiwygForm from "../../components/form/WysiwygForm";
import { postMedia, postTweet } from "../../services/tweetServices";
import TweetButton from "../buttons/TweetButton";

const BASE_URL = axiosInstance.defaults.baseURL

export default function CreateTweet(props) {
  const { updateTweetsList, tweet } = props
  const authContext = useContext(AuthContext)

  const action = (tweet) => {
    updateTweetsList(tweet)
  }
  const uploadImage = async (file) => {
    return await postMedia(file)
  }
  const handleTweetPost = async function (formContent, file) {
    let userId, mentionnedPeople
    userId = authContext.user.uid
    mentionnedPeople = []

    if (file == null && (formContent == null || formContent.trim().length === 0))
      return

    const filename = await uploadImage(file)
    let content = formContent == null ? '' : formContent.trim()

    if (file !== null) {
      const imageUrl = BASE_URL + '/' + filename.filename
      const mimeType = filename.mimetype
      content += '<br/>'
      if (mimeType.toLowerCase().includes('video')) {
        content += `<video onclick="event.stopPropagation()" controls muted> <source src="${imageUrl}" type="${mimeType}"/> </video>`

      } else {

        content += `<img src="${imageUrl}" alt="test"/>`
      }
    }
    const data = { userId, content, mentionnedPeople }
    if (tweet != null) {
      data['tweetId'] = tweet.uid
    }
    const results = await postTweet(data)
    await action(results)
  }
  return (
    <WysiwygForm action={handleTweetPost} placeholder="Quoi de neuf ?" button={<TweetButton />}/>
  )
}