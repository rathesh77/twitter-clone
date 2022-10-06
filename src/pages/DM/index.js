import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../authContext';
import Chat from './chat';
import { Manager } from "socket.io-client";
import SearchEngine from '../../components/SearchEngine';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';

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

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [selectedChat, setSelectedChat] = useState(null)
    const [chats, setChats] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [selectedRecipients, setSelectedRecipients] = useState([])

    const authContext = useContext(AuthContext)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setSearchResults([])
        setSelectedRecipients([])
        setOpen(false)
    };

    useEffect(() => {
        // recuperer la liste des DM de l'utilisateur courant
        socket.connect()
        socket.on('connect', () => {
            console.log('connected')
            socket.emit('get_chats', authContext);

        });

        socket.on('message', () => {
            console.log('message received')
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
        };
    }, [])

    const sendMessage = () => {
        socket.emit('message');
    }
    const handleSearchItemClick = async (e, item) => {
        console.log(item)
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
            <div className='middle-section'>
                <h1>Messages</h1>
                <TextField id="outlined-basic" label="Cherchez dans les messages privés" variant="outlined" sx={{ marginBottom: '10px', width: '100%' }} />

                <Button onClick={handleOpen}>Open modal</Button>
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
                            console.log(s)
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
                        <div className='searsch-results'>
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

                </div>
            </div>
            <div className='right-section'>
                <Chat selectedChat={selectedChat} />
            </div>
        </div>
    )
}

