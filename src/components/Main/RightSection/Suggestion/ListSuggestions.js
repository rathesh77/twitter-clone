import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Suggestion from './Suggestion'

export default function ListSuggestions() {
  return (
      <List className="suggestions">
        <div className='right-section-title'>Tendances pour vous</div>
        <ListItem disablePadding>
            <Suggestion title='Suggestion'/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='Suggestion'/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='Suggestion'/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='Suggestion'/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='Suggestion'/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='Suggestion'/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='Suggestion'/>
        </ListItem>
      </List>

   

  );
}
