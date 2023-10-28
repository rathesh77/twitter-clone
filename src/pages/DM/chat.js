import { Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../authContext';
import Message from '../../components/Message';
import SendIcon from '@mui/icons-material/Send';
import WysiwygForm from '../../components/form/WysiwygForm';
import { postMedia } from '../../services/tweetServices';
import { axiosInstance } from '../../axios';
import WebRTC from '../../components/WebRTC/WebRTC';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faPhoneSlash } from '@fortawesome/free-solid-svg-icons'

const style = {
    'editor': {
        display: 'flex',
        justifyContent: 'space-between',
    },
    'textField': {
        attributes: {
            variant: 'outlined'
        }
    }
}
const BASE_URL = axiosInstance.defaults.baseURL

export default function Chat(props) {
    /*
        props: {
            selectedChat: {
                messages: [],
                recipients: []
            }
            createChat: function,
            postMessage: chat
        }
    */
  
   const authContext = useContext(AuthContext)
   const { selectedChat, createChat, postMessage, emitWritingEvent } = props
   const { recipients } = selectedChat
   
   const [event, setEvent] = useState(null)
   const [localStreamInfos, setLocalStreamInfos] = useState({})
   const [startButtonEnabled, setStartButtonEnabled] = useState(true);
   const [hangupButtonEnabled, setHangupButtonEnabled] = useState(false);
   const [isCallRunning, setIsCallRunning] = useState(false)
   
   const messagesListContainer = useRef(null);
    let localVideo = useRef(null);
    const [recipientsVideos, setRecipientsVideos] = useState([useRef({}), useRef({}), useRef({}), useRef({}), useRef({}), useRef({})])

    const updateStreams = function(s) {
        const {peer, stream, video, audio, userId} = s
        for (const recipient of recipientsVideos) {
            if (!recipient.current.peer || recipient.current.peer === peer) {
              recipient.current.srcObject = stream
              recipient.current.peer = peer

              const recipientUser =  selectedChat.recipients.find((r) => r.uid === userId)
              recipient.current.avatar = recipientUser ? (recipientUser.avatar) : (authContext.user.avatar ? authContext.user.avatar : '')
              recipient.current.video = video
              recipient.current.audio = audio
              break
            }
          }
          setRecipientsVideos([...recipientsVideos])     
    }
    
    const callbackWhenCallStarts= (localStream) =>{
        localVideo.current.srcObject = localStream;
        setHangupButtonEnabled(true)
    }

    const callbackWhenUserLeaves = (leaver) => {
        for (const recipient of recipientsVideos) {
            if (recipient.current.peer === leaver) {
              delete recipient.current.peer
              delete recipient.current.avatar
              delete recipient.current.video
              delete recipient.current.audio

              break
            }
          }
          setRecipientsVideos(recipientsVideos)
    }
    const callbackWhenCallStops = () => {
        for (const recipient of recipientsVideos) {
          delete recipient.current.peer
          delete recipient.current.avatar
          delete recipient.current.video
          delete recipient.current.audio
        }
    
        setStartButtonEnabled(true)
        setHangupButtonEnabled(false)

        setEvent(null)

        setIsCallRunning(false)
    }
    const startButtonClick = async function () {
      if (startButtonEnabled) {
        setEvent('startCall')
        setStartButtonEnabled(false)
      }
      }
    
      const hangupButtonClick = async function () {
        if (hangupButtonEnabled) {
          setEvent('stopCall')
          setStartButtonEnabled(true)
          setHangupButtonEnabled(false)
        }
      };

    const uploadImage = async (file) => {
        return await postMedia(file)
    }

    const handleMessagePost = async (formContent, file) => {
        if (file == null && (formContent == null || formContent.trim().length === 0))
            return

        const filename = await uploadImage(file)
        let content = formContent == null ? '' : "<div>" + formContent.trim() + "</div>"

        if (file !== null) {
            const imageUrl = BASE_URL + '/' + filename.filename
            const mimeType = filename.mimetype
            if (formContent.trim().length > 0) {
                content += '<br/>'
            }
            if (mimeType.toLowerCase().includes('video')) {
                content += `<video onclick="event.stopPropagation()" controls muted> <source src="${imageUrl}" type="${mimeType}"/> </video>`
            } else {
                content += `<img src="${imageUrl}" alt="test"/>`
            }
        }
        const newMessage = {
            author: authContext.user,
            content,
            date: Date.now()
        }
        if (selectedChat.messages.length === 0) {
            createChat(newMessage)
        } else {
            postMessage({ ...newMessage, chatId: selectedChat.chatId })
        }
    }

    const findAuthorOfMessage = (message) => {
        const recipient = recipients.find((r) => r.uid === message.userId)
        if (recipient == null) {
            return authContext.user
        }
        return recipient
    }

    useEffect(() => {
        messagesListContainer.current.scrollTop = messagesListContainer.current.scrollHeight
    })

    return (
        <div className='selected-DM'>
            <div className='DM-header-container'>
                <div className='DM-header'>
                    <h1>
                        {recipients.map((r) => {
                            return (<span key={r.uid}>{r.username}</span>)
                        })}
                    </h1>
                    <div className="call-buttons">
                        <span className='call-button' style={startButtonEnabled ? { opacity: '1', cursor: 'pointer' } : { opacity: '0.3', cursor: 'not-allowed' }} disabled={!startButtonEnabled} onClick={startButtonClick} id="startButton"><FontAwesomeIcon icon={faPhone} size='lg' /></span>
                        <span className='call-button' style={hangupButtonEnabled ? { opacity: '1', cursor: 'pointer' } : { opacity: '0.3', cursor: 'not-allowed' }} disabled={!hangupButtonEnabled} onClick={hangupButtonClick} id="hangupButton"><FontAwesomeIcon icon={faPhoneSlash} size='lg' /></span>
                    </div>
                    <WebRTC setLocalStreamInfos={setLocalStreamInfos} setIsCallRunning={setIsCallRunning} event={event} chatId={selectedChat.chatId} callbackWhenUserLeaves={callbackWhenUserLeaves} updateStreams={updateStreams} callbackWhenCallStarts={callbackWhenCallStarts} callbackWhenCallStops={callbackWhenCallStops}></WebRTC>
                </div>
                <div className='call-participants'>
                    {
                        !localStreamInfos.video && isCallRunning ? <div className='call-participant-avatar' style={{ backgroundImage: `url(${authContext.user.avatar})` }} > </div>
                            : ''
                    }
                    <video style={{ display: isCallRunning && localStreamInfos.video ? 'inline-block' : 'none', padding: '10px' }} id="localVideo" ref={localVideo} playsInline={true} autoPlay={true} muted></video>

                    {(new Array(recipientsVideos.length)).fill(1).map((_, index) => {
                        const shouldDisplayCam = recipientsVideos[index].current.peer && recipientsVideos[index].current.video && isCallRunning
                        return (
                            <div key={index}>
                                <video ref={recipientsVideos[index]} style={{ display: shouldDisplayCam ? 'inline-block' : 'none', padding: '10px' }} id={'video' + index} playsInline={true} autoPlay={true}></video>
                                {isCallRunning && recipientsVideos[index].current.peer && !recipientsVideos[index].current.video ?
                                    <div className='call-participant-avatar' style={{ backgroundImage: `url(${recipientsVideos[index].current.avatar})` }}></div>
                                    : ''
                                }
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='DM-messages' ref={messagesListContainer}>
                {selectedChat.messages.map((m) => {
                    return (
                        <Message key={m.id} content={m.content} author={findAuthorOfMessage(m)} date={m.date} />
                    )
                })}
            </div>
            <div className='write-message'>
                <WysiwygForm placeholder="Ecrire un message" emitWritingEvent={emitWritingEvent} action={handleMessagePost} button={<Button><SendIcon /></Button>} style={style} />
            </div>
        </div>
    )
}

