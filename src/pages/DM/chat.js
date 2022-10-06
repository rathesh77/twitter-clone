import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export default function Chat(props) {

    const { selectedChat } = props


    return (
        <div className='selected-DM'>
            <div className='DM-header'>

            </div>
            <div className='DM-messages'>

            </div>
            <div className='write-message'>

            </div>
        </div>
    )
}

