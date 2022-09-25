import { useState } from "react";
import { Avatar } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IosShareIcon from "@mui/icons-material/IosShare";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import formatDate from "../../../../helper";

export default function Tweet(props) {
  const [message] = useState(props.content);
  const [author] = useState(props.author);
  const [timestamp] = useState(formatDate(props.date));
  const [likes] = useState(props.likes);
  const [replies] = useState(props.replies);
  let userRelations = null;
  if (props.userRelations != null) {
    userRelations =
      props.userRelations == null
        ? null
        : props.userRelations.map((e) => e.author.username);

    if (userRelations.length > 1) {
      userRelations = userRelations.join(", ") + " ont retweeté";
    } else {
      userRelations = userRelations.join(", ") + " a retweeté";
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
              <div className="tweet-author-name">{author.username}</div>
              <div className="tweet-author-tag">@{author.username}</div>
              <div className="tweet-timestamp">{timestamp}</div>
            </div>
            <div
              className="tweet-message"
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
            <div className="tweet-buttons">
              <div className="tweet-button">
                <div>{replies}</div>
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
