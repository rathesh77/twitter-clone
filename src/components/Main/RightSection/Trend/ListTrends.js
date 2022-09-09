import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Trend from './Trend'

export default function ListTrends() {
  return (
      <List className="trends">
        <div className='right-section-title'>Tendances pour vous</div>
        <ListItem disablePadding>
            <Trend title='#trend'/>
        </ListItem>
        <ListItem disablePadding>
            <Trend title='#trend'/>
        </ListItem>
        <ListItem disablePadding>
            <Trend title='#trend'/>
        </ListItem>
        <ListItem disablePadding>
            <Trend title='#trend'/>
        </ListItem>
        <br/>
        <a href="test" className='see-more'>Voir plus</a>
      </List>
  );
}
