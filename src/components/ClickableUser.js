import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ClickableUser(props) {
  const [user] = useState(props.user);
  const {pathname} = useLocation()
  const className = props.className
  const navigate = useNavigate()
  
  const handleUsernameClick = (e) => {
    e.stopPropagation()
    if (pathname.slice(1) !== user.username)
      navigate(`/${user.username}`, { state: { userId: user.uid } })

  }

  return (
    <div className={"clickable " + className} onClick={handleUsernameClick}>
      {props.children}
    </div>
  );
}
