import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Timeline from './Timeline';
import ViewTweet from '../../ViewTweet.js';
import Profile from './Profile';

export default function MiddleSection() {
  return (
    <div className='middle-section'>
      <Routes>
        <Route
          path="tweet"
          element={<ViewTweet/>}
        />
        <Route path='' element={<Timeline />} />
        <Route path=':name' element={<Profile />} />
      </Routes>
    </div>
  )
}

