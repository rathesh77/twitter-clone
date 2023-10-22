import { Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../authContext';
import Message from '../../components/Message';
import SendIcon from '@mui/icons-material/Send';
import WysiwygForm from '../../components/form/WysiwygForm';
import { postMedia } from '../../services/tweetServices';
import { axiosInstance } from '../../axios';
import Call from '../../components/WebRTC/Call';

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
    const messagesListContainer = useRef(null);

    const authContext = useContext(AuthContext)
    const { selectedChat, createChat, postMessage, emitWritingEvent, socket } = props
    const { recipients } = selectedChat
    const [messages] = useState(selectedChat.messages)

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
        if (messages.length === 0) {
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
                    <Call socket={socket} recipients={recipients} selectedChat={selectedChat}></Call>

                </div>
            </div>

            <div className='DM-messages' ref={messagesListContainer}>
                {messages.map((m) => {
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

