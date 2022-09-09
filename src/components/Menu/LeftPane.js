import { List, ListItem, ListItemButton } from '@mui/material'

export default function LeftPane() {
  return (
    <div className="left-pane-container">

      <div className="left-pane">
        <div>
          <List>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'>Accueil</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'>Explorer</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'>Notifications</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'>Messages</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'>Signets</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'>Listes</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton className='menu-item'>Profile</ListItemButton>
            </ListItem>
          </List>
        </div>
        <div className="profile-shortcut">
          profile shortcut
        </div>
      </div>
    </div>

  )
}