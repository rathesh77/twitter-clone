import { useState, useEffect, useContext } from 'react'
import { Tabs, Tab } from '@mui/material'
import UserInfos from '../../../components/UserInfos'
import { Avatar, Button, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

import AuthContext from '../../../authContext'
import { useLocation } from 'react-router-dom'
import { fetchRelatedTweets, findLikedTweetsByUser } from '../../../services/tweetServices'
import { doesCurrentUserFollowRecipient, fetchFollowersCount, fetchFollowingsCount, fetchUser, followUser } from '../../../services/userServices'
import ListTweets from '../../../components/List/ListTweets'
import { axiosInstance } from '../../../axios';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function Profile(props) {

  const tweets = [
    /* {
       author: {
         id: 0,
         name: '',
         avatar: ''
       },
       message: ``
     }
    */
  ]
  const { state } = useLocation();
  const [value, setValue] = useState(0)
  const [userTweets, setUserTweets] = useState(tweets)
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)

  const [isFollowing, setIsFollowing] = useState(false)
  const [likedTweets, setLikedTweets] = useState([])
  const authContext = useContext(AuthContext)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = ()=> {

  }

  const handleUserFollow = async () => {
    try {
     const response = await followUser(user.uid)
     if (response.status && response.status === 200) {
      const isFollowing = response.data.isFollowing
      setIsFollowing(isFollowing)
     }
    } catch (e) {
      console.log(e)
    }
  }

  const handleHoverFollowButton = (e) => {
    if (isFollowing === true)
      e.target.innerText = 'Se désabonner'
  }
  const handleUnhoverFollowButton = (e) => {
    if (isFollowing === true)
      e.target.innerText = 'Abonné'
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
});

  const editProfil = async (e) => {
    e.preventDefault();
    console.log(e)
    const formElements = e.target

    const data = {}
    for (const element of formElements) {
      if (element.id && element.id.length) {
        //console.log(element.value)
        console.log(element.id + ': ')
        console.log(element)
        switch (element.type) {
          case 'file':
            if (element.files[0]) {

              const base64String = await toBase64(element.files[0])
              const { size, name} = element.files[0]
              const {width, height } = element
              data[element.id] = {
                base64String,
                size, name
              }
            }
            break;
          case 'text':
            if (element.value && element.value.trim().length)
              data[element.id] = element.value.trim()
            break;
          case 'password':
            if (element.value && element.value.length)
              data[element.id] = element.value
            break;

        }

      }
    }
    console.log(data)
    await axiosInstance.put('/user', data)
    authContext.getMe()
  }

  console.log('refresh profil')
  useEffect(() => {
    (async () => {
      const currentUserId = state == null ? authContext.user.uid : state.userId
      const currentUser = await fetchUser(currentUserId)
      let followers = await fetchFollowersCount(currentUserId)

      let followings = await fetchFollowingsCount(currentUserId)
      setUser({...currentUser, followers, followings})
      if (currentUser.uid !== authContext.user.uid ) {
        const isFollowing = await doesCurrentUserFollowRecipient(currentUser.uid)
        if (isFollowing !== false) {
          setIsFollowing(true)
        } else {
          setIsFollowing(false)

        }
      }
      const userId = currentUser.uid
      const results = await fetchRelatedTweets(userId)
      const tweets = []
      for (const res of results) {
        if (res.relation !== 'WROTE_TWEET')
          continue
        tweets.push(res)
      }
      setUserTweets(tweets)
      setLikedTweets(await findLikedTweetsByUser(userId))
    })()
  }, [state, authContext.user])
  if (user == null) {
    return (<div>LOADING</div>)
  }
  let content = 0

  if (value === 0)
    content = (<ListTweets tweets={userTweets} />)
  else if (value === 3) {
    content = (<ListTweets tweets={likedTweets} />)
  } 
  return (
    <div className='user-profile'>
          <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                        <div className='dm-modal-header' style={{justifyContent:'space-between'}}>
                        <span className='dm-modal-title'>Modifier le profil</span>
                        <Button onClick={()=> {setOpen(false);}}><CloseIcon/></Button>
                        </div>
                          <form onSubmit={editProfil} style={{display: 'flex', flexDirection: 'column'}}>
                            email <TextField type='text' name='email' id="email"  variant="outlined"  disabled value={authContext.user.email} />
                            Nom d'utilisateur <TextField type='text' name='username' id="username" variant="outlined" placeholder={authContext.user.username}/>
                            Mot de passe <TextField name='password' id="password" variant="outlined" type='password' />
                            avatar <input id="avatar" type="file"  accept="image/*"/>
                            banner <input id="banner" type="file"  accept="image/*"/>
                            <Button type='submit'>go</Button>
                            </form>
                    </Box>

                </Modal>
      <div className='user-banner'>
        <div className="user-profile-pic" style={{backgroundImage: `url('${user.banner}')`}}></div>
        {user.uid === authContext.user.uid ? <button className='btn btn-edit-profile' onClick={()=>{setOpen(true)}}>Éditer le profil</button> : null}
      </div>
      <div className='user-profile-avatar-wrapper'>
        <Avatar sx={{ width: "140px", height: "140px" }} src={user.avatar} alt='profile pic' />
        {user.uid !== authContext.user.uid ? <button onMouseEnter={handleHoverFollowButton} onMouseOut={handleUnhoverFollowButton} className='btn' onClick={handleUserFollow}>
          {isFollowing === true ? "Abonné" : 'Suivre'}
        </button> : null}
      </div>
      <UserInfos user={user}/>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Tweets" />
        <Tab label="Tweets et réponses" />
        <Tab label="Medias" />
        <Tab label="J'aime" />

      </Tabs>
      {content}
    </div>
  );
}
