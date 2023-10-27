import WysiwygForm from "../../components/form/WysiwygForm";
import TweetButton from "../buttons/TweetButton";
import {uploadTweet} from '../../tools/tweet.tools'

export default function CreateTweet(props) {
  const { updateTweetsList, tweet } = props

  const handleTweetPost = async function (formContent, file) {
   const createdTweet = await uploadTweet(formContent, file, tweet)
   await updateTweetsList(createdTweet)
  }
  return (
    <WysiwygForm action={handleTweetPost} placeholder="Quoi de neuf ?" button={<TweetButton />}/>
  )
}