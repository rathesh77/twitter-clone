import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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
        <ListItem disablePadding>
            <Trend title='#trend'/>
        </ListItem>
        <ListItem disablePadding>
            <Trend title='#trend'/>
        </ListItem>
        <ListItem disablePadding>
            <Trend title='#trend'/>
        </ListItem>
      </List>
  );
}
