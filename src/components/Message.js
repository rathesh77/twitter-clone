import { useContext, useState } from "react";
import AuthContext from "../authContext";

export default function Message(props) {
  const authContext = useContext(AuthContext)
  const [message] = useState(props.content);
  const [author] = useState(props.author);
  const [timestamp] = useState(props.date);

  const align = authContext.user.uid === author.uid ? 'flex-end' : 'flex-start'
  return (
    <div className="message-wrapper">
      <div style={{ display: 'flex', justifyContent: align }}>
        <div className="message-content">
          <div className="message-header" style={{ justifyContent: align }}>
            {author.uid == authContext.user.uid ? null : (
              <div className="message-author-tag">{author.username}</div>
            )}
          </div>
          <div
            className="message-text"
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
          <div className="message-timestamp">{timestamp}</div>

        </div>
      </div>
    </div>
  );
}
