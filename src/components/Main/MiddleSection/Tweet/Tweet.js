import { useContext, useState } from "react";
import { Avatar } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IosShareIcon from "@mui/icons-material/IosShare";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import formatDate from "../../../../helper";
import ClickableUser from "../../../ClickableUser";
import { axiosInstance } from "../../../../axios";
import AuthContext from "../../../../authContext";

export default function Tweet(props) {
  const authContext = useContext(AuthContext)
  const [uid] = useState(props.uid);
  const [message] = useState(props.content);
  const [author] = useState(props.author);
  const [timestamp] = useState(formatDate(props.date));
  const [likes] = useState(props.likes);
  const [retweets, setRetweets] = useState(props.retweets);
  const [replies] = useState(props.replies);
  const [userRelations] = useState(props.userRelations != null ? props.userRelations : [])

  const handleRetweetClick = async (e) => {
    e.stopPropagation()
    await axiosInstance.post(`/retweet/${uid}`)
    setRetweets(retweets + 1)
  }

  let headerRelation = userRelations
    .filter((e) => e.author.uid !== authContext.user.uid)
    .map((e) => e.author.username)
  
  console.log(headerRelation)

  return (
    <div className="tweet-wrapper">
      <div>
        <div>
          {headerRelation.length > 0 ? 
          <div className="user-relations">
            <AutorenewIcon />{headerRelation.join(', ') + (headerRelation.length > 1 ? ' ont retweeté' : ' a retweeté')}
          </div> : 
          null}
        </div>
        <div style={{ display: 'flex' }}>
          <div className="tweet-author-avatar">
            <Avatar src={author.avatar} alt={author.name} />
          </div>

          <div className="tweet-content">
            <div className="tweet-header">
              <ClickableUser className="tweet-author-name" user={author} />
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
              <div className="tweet-button" onClick={handleRetweetClick}>
                <div>{retweets}</div>
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
