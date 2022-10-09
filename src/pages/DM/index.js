import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../authContext';
import Chat from './chat';
import { Manager } from "socket.io-client";
import SearchEngine from '../../components/SearchEngine';
import { Avatar, Button, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { fetchUser } from '../../services/userServices';

const manager = new Manager("http://localhost:8080", {
    autoConnect: false,
    secure: false,
    withCredentials: true
})

const socket = manager.socket("/")

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function DM() {

    const authContext = useContext(AuthContext)

    const [searchResults, setSearchResults] = useState([])
    const [selectedRecipients, setSelectedRecipients] = useState([])
    const [open, setOpen] = useState(false)
    const [chats, setChats] = useState({})
    const [selectedChatId, setSelectedChatId] = useState(null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        /*
       ---------- MODEL D'UN CHAT: ---------
               idChat <- "0": {
                    chatId,
                    messages,
                    recipients <- ne doit pas inclure l'user courant
                }
        */
        /*
        - creer un chat
            - creer un chat avec un id temporaire quand il est vide
            - à l'envoi du premier message, on met à jour l'id temporaire
        */
        if (selectedRecipients.length > 0) {
            const tempChatId = 'temp-'+Math.random()
            const chat = {}
            chat.chatId = tempChatId
            chat.messages = []
            chat.recipients = selectedRecipients

            const _chats = {...chats}
            _chats[tempChatId] = chat
            setChats(_chats)
            setSelectedChatId(tempChatId)
        }
        setSearchResults([])
        setSelectedRecipients([])
        setOpen(false)
    };

    const createChat = (message)=>{
        const _chats = {...chats}
        const obj = {
            author: authContext.user.uid, 
            recipients: _chats[selectedChatId].recipients,
            content: message.content
        }
        //setChats(_chats)
        socket.on('chat_created', ({chatId, messageId})=>{
            console.log('chat_created:', chatId)
            socket.off('chat_created')
            _chats[chatId] = _chats[selectedChatId]
            _chats[chatId].messages.push({...message, messageId})
            _chats[chatId].chatId = chatId
            delete _chats[selectedChatId]
            setChats(_chats)
            setSelectedChatId(chatId)
        })

        socket.emit('create_chat', obj)
        
    }
    const postMessage = (message)=>{
        const _chats = {...chats}
        socket.on('posted_message', (messageId)=>{
            socket.off('posted_message')
            _chats[selectedChatId].messages.push({...message, messageId})
            setChats(_chats)
        })

        const obj = {
            author: authContext.user.uid, 
            chatId: message.chatId,
            content: message.content
        }
        socket.emit('post_message', obj)

    }

    console.log(chats)
    useEffect(() => {
        // recuperer la liste des DM de l'utilisateur courant
        socket.connect()
        socket.on('connect', () => {
            console.log('connected')
            socket.emit('get_chats', authContext.user);

        });

        socket.on('message', () => {
            console.log('message received')
        });

        
        socket.on('chats_list', async (data) => {
            /*
            [
                {
                    chatId,
                    idUser,
                    content: nullable,
                    messageId : nullable
                }
                ...
            ]
            */
           /*
            chats : {
               idChat <- "0": {
                    chatId,
                    messages,
                    recipients <- ne doit pas inclure l'user courant
                }
                ...
            }
           */
            let chats = {}
            console.log(data)
            for (const chat of data) {
                const {chatId, idUser, content, messageId, date} = chat
                if (!chats[chatId]) {
                    chats[chatId] = {chatId, messages: [], recipients : []}
                }
                if (messageId != null) {
                    chats[chatId].messages.push({messageId, content, idUser, date})
                }
                if (idUser != authContext.user.uid && chats[chatId].recipients.find((r) => r.uid == idUser) == null) {
                    chats[chatId].recipients.push(await fetchUser(idUser))
                }
            }
            console.log(chats)
            setChats(chats)
            console.log(data)
        });


        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
        };
    }, [])

    const handleSearchItemClick = async (e, item) => {
        if (item.uid === authContext.user.uid) {
            return
        }
        for (let i = 0; i < selectedRecipients.length; i++) {
            if (item.uid === selectedRecipients[i].uid) {
                return
            }
        }
        setSelectedRecipients([...selectedRecipients, item])
        setSearchResults([])
    }
    console.log('refresh', chats)
    return (
        <div className='dm-container'>
            <div className='middle-section shrink-1'>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1>Messages</h1>
                    <Button onClick={handleOpen}>new chat</Button>

                </div>
                <TextField id="outlined-basic" label="Cherchez dans les messages privés" variant="outlined" sx={{ marginBottom: '10px', width: '100%' }} />

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className='dm-modal-header'>
                            <h2>Nouveau messages</h2>
                            <Button onClick={handleClose}>Suivant</Button>
                        </div>
                        <SearchEngine setSearchResults={setSearchResults} />
                        <div className='selected-recipients'>

                        {selectedRecipients.map((s) => {
                                return (
                                    <div key={s.uid} className='recipient-item' >
                                        <Avatar sx={{ width: "30px", height: "30px" }} src={s.avatar} alt='Spic' />
                                        <div>
                                            <span>
                                                {s.username}
                                            </span>
                                        
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div> {/* search results*/} 
                            {searchResults.map((s) => {
                                const properties = s._fields[0].properties
                                return (
                                    <div key={properties.uid} className='search-item' onClick={(e) => { handleSearchItemClick(e, properties) }}>
                                        <Avatar sx={{width: "60px", height: "60px" }} src={properties.avatar} alt='Spic' />
                                        <div>
                                            <div>
                                                {properties.username}
                                            </div>
                                            <div>
                                                @{properties.username}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Box>
                </Modal>
                <div className='DMs-list'>
                    {Object.keys(chats).map((chatId)=>{
                        const chat = chats[chatId]
                        return (
                            <div key={chatId} className='DM-item' onClick={()=>{setSelectedChatId(chatId)}}>
                                {chat.recipients.map((cr)=>{
                                    return (
                                        <span key={cr.uid}>{cr.username}</span>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='grow-1'>
                {selectedChatId == null ? null : <Chat key={selectedChatId} selectedChat={chats[selectedChatId]} createChat={createChat} postMessage={postMessage}/>}
            </div>
        </div>
    )
}

