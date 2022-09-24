import {useState} from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useContext } from 'react';
import AuthContext from '../../../../authContext';

export default function UserInfos() {
  const authContext = useContext(AuthContext)
  const [nickname] = useState(authContext.user.username)
  return (
    <div className='user-infos'>
      <div className='user-name-wrapper'><span className='user-nickname'>{nickname}</span><br/><span className='user-tagname'>@{nickname}</span></div>
      <div className='user-date-registration'><CalendarMonthIcon/> A rejoint Twitter en septembre 2020</div>
      <div className='user-subs-infos'>
        <div className='user-subscribed-to'>15 abonnements</div>
        <div className='user-subscribers'>20 abonnés</div>
      </div>

    </div>
  );
}
