import CreateTweet from './Tweet/CreateTweet.js'
import ListTweets from './Tweet/ListTweets.js'
import { Route, Routes} from 'react-router-dom';
import Profile from './UserProfile/Profile.js';

export default function MiddleSection() {
  const messages = [
    {
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    },{
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    },{
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    },{
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    },{
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    },{
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    }, {
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    }, {
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    }, {
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    }, {
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    }, {
      author: {
        id: 1,
        name: 'Rathesh',
        avatar: 'https://pbs.twimg.com/profile_images/1557819838222966785/JeYuvKvT_400x400.jpg'
      },
      message: `Won 2-1 against @dynamoeclot in the @cctour_gg , insane mirage from us !
      Let's go for the semi-final tomorrow at 10 AM ! 🤩`
    },
  ]
  return (
    <div className='middle-section'>
      <Routes>
        <Route path='/' element={<div><CreateTweet/><ListTweets messages={messages}/></div>}/>
        <Route path='/profil' element={<Profile/>}/>
      </Routes>

      </div>
  );
}
