import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../authContext';
import Chat from './chat';
import SearchEngine from '../../components/SearchEngine';
import { Avatar, Button, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { fetchUser } from '../../services/userServices';
import { blue } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';


import ClickableUser from '../../components/ClickableUser';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import UsersWriting from '../../components/UsersWriting';
import { socket } from '../../socket';


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
               chatId <- "0": {
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
            for (const chatId in chats) {
                const chat = chats[chatId]
                let occurences = 0
                if (selectedRecipients.length !== chat.recipients.length) {
                    continue
                }
                for (const chatRecipient of chat.recipients) {
                    for (const recipient of selectedRecipients) {
                        if (recipient.uid === chatRecipient.uid) {
                            occurences++
                            break
                        }
                    }
                }
                if (occurences === chat.recipients.length)
                    return
            }
            const tempChatId = 'temp-' + Math.random()
            const chat = {}
            chat.chatId = tempChatId
            chat.messages = []
            chat.recipients = selectedRecipients

            const _chats = { ...chats }
            _chats[tempChatId] = chat
            setChats(_chats)
            setSelectedChatId(tempChatId)
        }
        setSearchResults([])
        setSelectedRecipients([])
        setOpen(false)
    };

    const createChat = (message) => {
        const _chats = { ...chats }
        const obj = {
            recipients: _chats[selectedChatId].recipients,
            content: message.content
        }
        //setChats(_chats)
        socket.on('chat_created', (chat) => {
            socket.off('chat_created')
            _chats[chat.id] = _chats[selectedChatId]
            _chats[chat.id].messages = chat.messages 
            _chats[chat.id].chatId = chat.id
            delete _chats[selectedChatId]
            setChats(_chats)
            setSelectedChatId(chat.id)
        })

        socket.emit('create_chat', obj)

    }
    const postMessage = (message) => {
        const _chats = { ...chats }
        socket.on('posted_message', (id) => {
            socket.off('posted_message')
            const {content, date} = message
            _chats[selectedChatId].messages.push({ content, date, userId: message.author.uid, id })
            setChats(_chats)
        })

        const obj = {
            userId: authContext.user.uid,
            chatId: selectedChatId,
            content: message.content
        }
        socket.emit('post_message', obj)

    }

    const emitWritingEvent = () => {
        socket.emit('writing', { chatId: selectedChatId })
    }

    const cleanListeners = (socket) => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('message');
        socket.off('chats_list');
        socket.off('user_invited_you');
        socket.off('user_posted_message');
        socket.off('posted_message');
        socket.off('chat_created');

    }
    useEffect(() => {
        // recuperer la liste des DM de l'utilisateur courant
        cleanListeners(socket)

      console.log(authContext)
        socket.on('message', () => {
            console.log('message received')
        });

        socket.on('user_invited_you', async (chat) => {
            socket.emit('get_chats');
        });

        socket.on('user_posted_message', (message) => {
            const { chatId } = message
            const _chats = { ...chats }
            _chats[chatId].messages.push(message)
            setChats(_chats)
        });

        socket.on('chats_list', async (data) => {
            /*
            [
                {
                    chatId,
                    userId,
                    content: nullable,
                    messageId : nullable
                }
                ...
            ]
            */
            /*
             chats : {
                chatId <- "0": {
                     chatId,
                     messages,
                     recipients <- ne doit pas inclure l'user courant
                 }
                 ...
             }
            */
            let chats = {}
            for (const chat of data) {
                const { chatId, userId, content, messageId, date } = chat
                if (!chats[chatId]) {
                    chats[chatId] = { chatId, messages: [], recipients: [] }
                }
                if (messageId != null) {
                    chats[chatId].messages.push({ id: messageId, content, userId, date })
                }
                if (userId !== authContext.user.uid && chats[chatId].recipients.find((r) => r.uid === userId) == null) {
                    chats[chatId].recipients.push(await fetchUser(userId))
                }
            }
            setChats(chats)
        });

        return () => {
            cleanListeners(socket)
        };
    }, [chats])


    useEffect(()=> {
        socket.emit('get_chats');
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

    return (
        <div className='dm-container'>
            <div className='dm-list-container'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Messages</h1>
                    <Button onClick={handleOpen}><MailOutlineIcon/></Button>

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
                            <Button><CloseIcon onClick={()=> {setOpen(false); setSelectedRecipients([]); setSearchResults([])}}/></Button>
                            <span className='dm-modal-title'>Nouveau messages</span>
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
                                const properties = s
                                return (
                                    <div key={properties.uid} className='search-item' onClick={(e) => { handleSearchItemClick(e, properties) }}>
                                        <Avatar sx={{ width: "60px", height: "60px" }} src={properties.avatar} alt='Spic' />
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
                    {Object.keys(chats).map((chatId) => {
                        const chat = chats[chatId]
                        return (
                            <div key={chatId} className='DM-item' onClick={() => { setSelectedChatId(chatId) }} style={{backgroundColor: chatId === selectedChatId ? blue[50]: 'white'}}>
                                {chat.recipients.map((cr) => {
                                    return (
                                        <span key={cr.uid}>
                                            <ClickableUser user={cr}>
                                                <Avatar src={cr.avatar} alt={cr.username}/>{cr.username}
                                            </ClickableUser>
                                        </span>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='current-dm'>
                {selectedChatId == null ? 
                    <div style={{padding: "50px", height: "100vh", display: 'flex', alignItems: 'center'}}> 
                    <div>
                        <h1>Sélectionnez un message.</h1>
                        Faites un choix dans vos conversations existantes, commencez-en une nouvelle ou ne changez rien.
                    </div>
                    </div> : 
                    <div>
                        <Chat socket={socket} emitWritingEvent={emitWritingEvent} key={selectedChatId + '/' + chats[selectedChatId].messages.length} selectedChat={chats[selectedChatId]} createChat={createChat} postMessage={postMessage} />
                        <div>
                            <UsersWriting key={selectedChatId} selectedChatId={selectedChatId} socket={socket}/>
                        </div>
                    </div>

                    }
            </div>
        </div>
    )
}