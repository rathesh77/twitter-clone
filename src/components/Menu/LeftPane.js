import { List, ListItem, ListItemButton } from '@mui/material'
import HouseIcon from '@mui/icons-material/House';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';

import { Link } from 'react-router-dom';

export default function LeftPane() {
  return (
    <div className="left-pane-container">

      <div className="left-pane">
        <div>
          <List>
            <Link to="/">
              <ListItem disablePadding>
                <ListItemButton className='menu-item'><HouseIcon/>Accueil</ListItemButton>
              </ListItem>
            </Link>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'><TagIcon/>Explorer</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'><NotificationsActiveIcon/>Notifications</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'><EmailIcon/>Messages</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'><BookmarkIcon/>Signets</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'><ListAltIcon/>Listes</ListItemButton>
            </ListItem>
            <Link to="/profil?a=1">
              <ListItem disablePadding>
                <ListItemButton className='menu-item'><PersonIcon/>Profile</ListItemButton>
              </ListItem>
            </Link>
          </List>
        </div>
        <div className="profile-shortcut">
          profile shortcut
        </div>
      </div>
    </div>

  )
}