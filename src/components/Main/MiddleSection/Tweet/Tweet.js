import { useState } from "react";
import { Avatar } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IosShareIcon from "@mui/icons-material/IosShare";
import AutorenewIcon from "@mui/icons-material/Autorenew";

export default function Tweet(props) {
  const [message] = useState(props.message);
  const [author] = useState(props.author);
  const [timestamp] = useState(props.timestamp);
  const [likes] = useState(props.likes);

  let userRelations = null;
  if (props.userRelations != null) {
    userRelations =
      props.userRelations == null
        ? null
        : props.userRelations.map((e) => e.author.username);

    if (userRelations.length > 1) {
      userRelations = userRelations.join(", ") + " ont réagit";
    } else {
      userRelations = userRelations.join(", ") + " a réagit";
    }
  }
  return (
    <div className="tweet-wrapper">
      <div>
        <div>{userRelations ? <div className="user-relations"><AutorenewIcon />{userRelations}</div> : null}</div>
        <div style={{display: 'flex'}}>
          <div className="tweet-author-avatar">
            <Avatar src={author.avatar} alt={author.name} />
          </div>

          <div className="tweet-content">
            <div className="tweet-header">
              <div className="tweet-author-name">{author.name}</div>
              <div className="tweet-author-tag">@{author.name}</div>
              <div className="tweet-timestamp">{timestamp}</div>
            </div>
            <div
              className="tweet-message"
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
            <div className="tweet-buttons">
              <div className="tweet-button">
                <div>{likes}</div>
                <ChatBubbleOutlineIcon />
              </div>
              <div className="tweet-button">
                <div>{likes}</div>
                <AutorenewIcon />
              </div>
              <div className="tweet-button">
                <div>{likes}</div>
                <FavoriteIcon />
              </div>
              <div className="tweet-button">
                <div>{likes}</div>
                <IosShareIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
