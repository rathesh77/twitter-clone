import CreateTweet from './Tweet/CreateTweet.js'
import ListTweets from './Tweet/ListTweets.js'

export default function FrontPane() {
  return (
    <div className="front-pane">
      <CreateTweet/>
      <ListTweets/>

    </div>
  )
}