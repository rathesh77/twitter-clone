import { List, ListItem } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import Tweet from '../../components/Tweet';
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
        <ListItem key={t.uid} onClick={(e)=> {handleTweetClick(e, t.uid)}} className='tweet-item' disablePadding>
          <Tweet {...t} />
        </ListItem>
      )
      )}
    </List>
  );
}
