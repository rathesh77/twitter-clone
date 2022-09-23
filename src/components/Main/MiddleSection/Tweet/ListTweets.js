import { List, ListItem } from '@mui/material'
import Tweet from './Tweet';
export default function ListTweets(props) {
  const {messages} = props
  
  return (
    <List className="tweets">
      {messages.map(m =>
      (
        <ListItem className='tweet-item' disablePadding key={Math.random()}>
          <Tweet  timestamp="23h" {...m} />
        </ListItem>
      )
      )}
    </List>
  );
}
