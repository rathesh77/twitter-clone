import { Button, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import AuthContext from '../../authContext';
import Message from '../../components/Message';
export default function Chat(props) {

    const authContext = useContext(AuthContext)
    const { selectedChat } = props
    const {recipients} = selectedChat
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    const handleSearchInput = (e) => {setMessage(e.target.value)}

    const handleMessagePost = () => {
        const newMessage = {author: authContext.user, content: message, date: '23h'}
        setMessages([...messages, newMessage])
    }

    return (
        <div className='selected-DM'>
            <div className='DM-header-container'>
                <div className='DM-header'>

                    {recipients.map((r)=>{
                        return (r.username)
                    }).join(', ')}
                </div>
            </div>

            <div className='DM-messages'>
                {messages.map((m) => {
                    return (
                        <Message key={m.date} {...m}/>
                    )
                })}
            </div>
            <div className='write-message'>
                <TextField onChange={handleSearchInput} label="Ecrire un message..." variant="outlined" sx={{ width: '100%' }} />
                <Button onClick={handleMessagePost}>envoyer le message</Button>
            </div>
        </div>
    )
}

