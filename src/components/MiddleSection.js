import CreateTweet from './Tweet/CreateTweet.js'
import ListTweets from './Tweet/ListTweets.js'

export default function MiddleSection() {
  return (
    <div className='middle-section'>
        <CreateTweet/>
        <ListTweets/>
      </div>
  );
}
