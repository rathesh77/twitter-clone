import { blue, grey } from "@mui/material/colors";
import { useContext, useState } from "react";
import AuthContext from "../authContext";
import {formatMillisecondsToDate} from '../helper'

export default function Message(props) {
  const authContext = useContext(AuthContext)
  const [message] = useState(props.content);
  const [author] = useState(props.author);
  const [date] = useState(formatMillisecondsToDate(props.date));
  const identity = authContext.user.uid === author.uid ? 'me' : 'their'
  const messageStyles = {
    'me': {
      justifyContent: 'flex-end',
      boxColor: blue[600],
      color: 'white',

    },
    'their':{
      justifyContent: 'flex-start',
      boxColor:  blue[50],
      color: 'black',

    }
  }
  return (
    <div className="message-wrapper" style={{justifyContent: messageStyles[identity].justifyContent}}>
      <div>
      {author.uid == authContext.user.uid ? null : (
              <div className="message-header">
                <div className="message-author-tag">{author.username}</div>
              </div>
            )}
        <div className="message-content" style={{backgroundColor: messageStyles[identity].boxColor, color: messageStyles[identity].color}}>
          <div
            className="message-text"
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        </div>
        <div className="message-timestamp">{date}</div>

      </div>
    </div>
  );
}
