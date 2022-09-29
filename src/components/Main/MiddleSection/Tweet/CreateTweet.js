import WysiwygForm from "../../../WysiwygForm";

export default function CreateTweet(props) {
  const { updateTweetsList } = props

  const action = (tweet)=> {
    updateTweetsList(tweet)
  } 
  return (
    <WysiwygForm action={action} />
  )
}