import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Suggestion from './Suggestion'

export default function ListSuggestions() {
  return (
      <List className="suggestions">
        <div className='right-section-title'>Vous pourriez aimer</div>
        <ListItem disablePadding>
            <Suggestion title='ShoxCSGO' avatar="https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg"/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='ShoxCSGO' avatar="https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg"/>
        </ListItem>
        <ListItem disablePadding>
            <Suggestion title='Dan Madesclaire' avatar="https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg"/>
        </ListItem>
        <br/>
        <a href="#" className='see-more'>Voir plus</a>
      </List>

   

  );
}
