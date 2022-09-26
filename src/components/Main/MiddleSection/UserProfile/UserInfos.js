import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function UserInfos(props) {
  const {user} = props
  return (
    <div className='user-infos'>
      <div className='user-name-wrapper'><span className='user-nickname'>{user.username}</span><br/><span className='user-tagname'>@{user.username}</span></div>
      <div className='user-date-registration'><CalendarMonthIcon/> A rejoint Twitter en septembre 2020</div>
      <div className='user-subs-infos'>
        <div className='user-subscribed-to'>15 abonnements</div>
        <div className='user-subscribers'>20 abonnés</div>
      </div>

    </div>
  );
}
