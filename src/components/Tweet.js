import { useState } from "react";
import { Avatar } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {formatDate} from "../helper";
import ClickableUser from "../components/ClickableUser";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { postLikeTweet, postDislikeTweet, postRetweet } from "../services/tweetServices";

export default function Tweet(props) {
  const [uid] = useState(props.uid);
  const [message] = useState(props.content);
  const [author] = useState(props.author);
  const [timestamp] = useState(formatDate(props.date));
  const [likes, setLikes] = useState(props.likes);
  const [retweets, setRetweets] = useState(props.retweets);
  const [dislikes, setDislikes] = useState(props.dislikes);
  const [enabledButtons, setEnabledButtons] = useState(true);

  const [replies] = useState(props.replies);
  const [userRelations] = useState(props.userRelations != null ? props.userRelations : [])

  const handleRetweetClick = async (e) => {
    e.stopPropagation()
    const results = await postRetweet(uid)
    const {retweetsIncrement} = results

    setRetweets(retweets + retweetsIncrement)
  }

  const handleLikeClick = async (e) => {
    e.stopPropagation()
    if (!enabledButtons)
      return
    console.log('process like')
    setEnabledButtons(false)

    const result = await postLikeTweet(uid)
    if (!result) {
      console.log('bug handleLikeClick')
      return
    }
    const {likesIncrement, dislikesIncrement} = result
    setLikes(likes + likesIncrement)
    setDislikes(dislikes + dislikesIncrement)
    setTimeout(()=> {
      setEnabledButtons(true)
    }, 2000)
  }

  const handleDislikeClick = async (e) => {
    e.stopPropagation()
    if (!enabledButtons)
      return
    console.log('process dislike')
    setEnabledButtons(false)
    const result = await postDislikeTweet(uid)
    if (!result) {
      console.log('bug handleDislikeClick')
      return
    }
    const {dislikesIncrement, likesIncrement} = result
    setDislikes(dislikes + dislikesIncrement)
    setLikes(likes + likesIncrement)
    setTimeout(()=> {
      setEnabledButtons(true)
    }, 2000)
  }

  let headerRelation = userRelations
    //.filter((e) => e.author.uid !== authContext.user.uid)
    .map((e) => e.author.username)
  

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
              <ClickableUser className="tweet-author-name" user={author}>
                <div>
                  {author.username}
                </div>
              </ClickableUser>
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
              <div className="tweet-button" onClick={handleLikeClick}>
                <div>{likes}</div>
                <FavoriteIcon />
              </div>
              <div className="tweet-button" onClick={handleDislikeClick}>
                <div>{dislikes}</div>
                <HeartBrokenIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
