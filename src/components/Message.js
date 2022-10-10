import { Avatar } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useContext, useState } from "react";
import AuthContext from "../authContext";
import { formatMillisecondsToDate } from '../helper'
import ClickableUser from "./ClickableUser";

export default function Message(props) {
  const authContext = useContext(AuthContext)
  const [message] = useState(props.content);
  const [author] = useState(props.author);
  const [date] = useState(formatMillisecondsToDate(props.date));
  const identity = authContext.user.uid === author.uid ? 'me' : 'their'
  const messageStyles = {
    'me': {
      justifyContent: 'flex-end',
      boxColor: blue[300],
      color: 'white',

    },
    'their': {
      justifyContent: 'flex-start',
      boxColor: grey[300],
      color: 'black',

    }
  }
  return (
    <div className="message-wrapper" style={{ justifyContent: messageStyles[identity].justifyContent }}>
      <div>
        {author.uid == authContext.user.uid ? <div></div> : (
          <div className="message-header">
            <div className="message-author-tag"><ClickableUser className="tweet-author-name" user={author}><Avatar src={author.avatar} /></ClickableUser></div>
          </div>
        )}
        <div>
          <div style={{ justifyContent: messageStyles[identity].justifyContent }}>
            <div className="message-content" style={{ backgroundColor: messageStyles[identity].boxColor, color: messageStyles[identity].color }} dangerouslySetInnerHTML={{ __html: message }}>
            </div>
          </div>

          <div className="message-timestamp">{date}</div>
        </div>


      </div>
    </div>
  );
}
