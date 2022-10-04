import WysiwygForm from "../../components/form/WysiwygForm";

export default function CreateTweet(props) {
  const { updateTweetsList } = props

  const action = (tweet)=> {
    updateTweetsList(tweet)
  } 
  return (
    <WysiwygForm action={action} />
  )
}