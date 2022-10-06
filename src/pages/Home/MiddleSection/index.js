import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Timeline from './Timeline';
import ViewTweet from '../../ViewTweet.js';
import Profile from './Profile';

export default function MiddleSection() {
  const { search, pathname } = useLocation()
  return (
    <div className='middle-section'>
      <Routes>
        <Route
          path="tweet"
          element={<ViewTweet key={search} />}
        />
        <Route path='' element={<Timeline />} />
        <Route path=':name' element={<Profile key={pathname} />} />
      </Routes>
    </div>
  )
}

