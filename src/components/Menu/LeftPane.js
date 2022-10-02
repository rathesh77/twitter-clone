import { List, ListItem, ListItemButton } from '@mui/material'
import HouseIcon from '@mui/icons-material/House';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../authContext';
import { logout } from '../../services/User';

export default function LeftPane() {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  const { pathname } = useLocation()
  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/login')
  }

  const handleGeneralClick = (e) => {
    const link = e.target.getAttribute('data-link')
    console.log(link, pathname)
    if (pathname !== link) {
      navigate(link)
    }
  }
  return (
    <div className="left-pane-container">

      <div className="left-pane">
        <div>
          <List onClick={handleGeneralClick}>
            <ListItem disablePadding>
              <ListItemButton data-link="/" className='menu-item'><HouseIcon />Accueil</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton data-link="/browse" className='menu-item'><TagIcon />Explorer</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton data-link="/notifications" className='menu-item'><NotificationsActiveIcon />Notifications</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton data-link="/messages" className='menu-item'><EmailIcon />Messages</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton data-link="/signets" className='menu-item'><BookmarkIcon />Signets</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton data-link="/lists" className='menu-item'><ListAltIcon />Listes</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton data-link={"/" + user.username} className='menu-item'><PersonIcon />Profile</ListItemButton>
            </ListItem>
            <ListItem disablePadding onClick={handleLogout}>
              <ListItemButton sx={{color: 'red'}} className='menu-item'><LogoutIcon />Se déconnecter</ListItemButton>
            </ListItem>
          </List>
        </div>

      </div>
    </div>

  )
}