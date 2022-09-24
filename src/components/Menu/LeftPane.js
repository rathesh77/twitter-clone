import { List, ListItem, ListItemButton } from '@mui/material'
import HouseIcon from '@mui/icons-material/House';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';

import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axios';
import { useContext } from 'react';
import AuthContext from '../../authContext';

export default function LeftPane() {
  const navigate = useNavigate()
  const {setUser} = useContext(AuthContext)
  const logout = async () => {
    await axiosInstance.delete('/logout')
    setUser(null)
    navigate('/login')
  }
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
            <Link to="profil">
              <ListItem disablePadding>
                <ListItemButton className='menu-item'><PersonIcon/>Profile</ListItemButton>
              </ListItem>
            </Link>
          </List>
        </div>
        <div className="profile-shortcut" onClick={logout}>
          Log out
        </div>
      </div>
    </div>

  )
}