import { Button, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../authContext';
import Message from '../../components/Message';
import SendIcon from '@mui/icons-material/Send';
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
    const { selectedChat, createChat, postMessage } = props
    const {recipients} = selectedChat
    const [messages, setMessages] = useState(selectedChat.messages)
    const [message, setMessage] = useState('')
    const handleSearchInput = (e) => {setMessage(e.target.value)}

    const handleMessagePost = () => {
        let trimmedMessage = message.trim()
        if (trimmedMessage.length == 0)
            return
        const newMessage = {
            author: authContext.user,
            content: trimmedMessage,
            date: Date.now()
        }
        if (messages.length == 0) {
            createChat(newMessage)
        } else {
            postMessage({...newMessage, chatId: selectedChat.chatId})
        }
        setMessage('')
    }
    
    const findAuthorOfMessage = (message) => {
        const recipient = recipients.find((r) => r.uid == message.idUser)
        if (recipient == null) {
            return authContext.user
        }
        return recipient
    }

    useEffect(()=>{
        messagesListContainer.current.scrollTop = messagesListContainer.current.scrollHeight
    })

    return (
        <div className='selected-DM'>
            <div className='DM-header-container'>
                <div className='DM-header'>
                    <h1>
                    {recipients.map((r)=>{
                        return (<span key={r.uid}>{r.username}</span>)
                    })}
                    </h1>
                </div>
            </div>

            <div className='DM-messages' ref={messagesListContainer}>
                {messages.map((m) => {
                    return (
                        <Message key={m.messageId} content={m.content} author={findAuthorOfMessage(m)} date={m.date}/>
                    )
                })}
            </div>
            <div className='write-message'>
                <TextField onChange={handleSearchInput} value={message} label="Ecrire un message..." variant="outlined" sx={{ width: '100%' }} />
                <Button onClick={handleMessagePost}><SendIcon/></Button>
            </div>
        </div>
    )
}

