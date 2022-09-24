import { List, ListItem } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import Tweet from './Tweet';
export default function ListTweets(props) {
  const {tweets} = props
  const navigate = useNavigate()
  const handleTweetClick = (e, tweetId) => {
    navigate(`/tweet?id=${tweetId}`)
  }
  return (
    <List className="tweets">
      {tweets.map(t =>
      (
        <ListItem onClick={(e)=> {handleTweetClick(e, t.uid)}} className='tweet-item' disablePadding key={Math.random()}>
          <Tweet  timestamp="23h" {...t} />
        </ListItem>
      )
      )}
    </List>
  );
}
