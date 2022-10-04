import React, { useEffect, useRef } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Timeline from '../../../pages/Timeline';
import ViewTweet from '../../../pages/ViewTweet.js';
import Profile from '../../../pages/Profile';
import RightSection from '../RightSection/index.js'

export default function MiddleSection() {
  const { search, pathname } = useLocation()
  return (
    <Routes>
        <Route
          path="tweet"
          element={<ViewTweet key={search}/>}
        />
        <Route path='' element={<Timeline />}/>
        <Route path=':name' element={<Profile key={pathname} />}/>
    </Routes>


  )
}

