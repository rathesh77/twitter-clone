import { Button, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import AuthContext from '../../authContext';
import Message from '../../components/Message';
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
    const { selectedChat, createChat, postMessage } = props
    const {recipients} = selectedChat
    const [messages, setMessages] = useState(selectedChat.messages)
    const [message, setMessage] = useState('')
    const handleSearchInput = (e) => {setMessage(e.target.value)}

    const handleMessagePost = () => {
        const newMessage = {
            author: authContext.user,
            content: message,
            date: Date.now()
        }
        if (messages.length == 0) {
            createChat(newMessage)
        } else {
            postMessage({...newMessage, chatId: selectedChat.chatId})

        }
    }
    const findAuthorOfMessage = (message) => {
        const recipient = recipients.find((r) => r.uid == message.idUser)
        if (recipient == null) {
            return authContext.user
        }
        return recipient
    }
    console.log(selectedChat)

    return (
        <div className='selected-DM'>
            <div className='DM-header-container'>
                <div className='DM-header'>
                    {recipients.map((r)=>{
                        return (<span key={r.uid}>{r.username}</span>)
                    })}
                </div>
            </div>

            <div className='DM-messages'>
                {messages.map((m) => {
                    return (
                        <Message key={m.messageId} content={m.content} author={findAuthorOfMessage(m)} date={m.date}/>
                    )
                })}
            </div>
            <div className='write-message'>
                <TextField onChange={handleSearchInput} value={message} label="Ecrire un message..." variant="outlined" sx={{ width: '100%' }} />
                <Button onClick={handleMessagePost}>envoyer le message</Button>
            </div>
        </div>
    )
}

