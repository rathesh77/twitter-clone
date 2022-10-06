import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import RightSection from '../../pages/Home/RightSection/index.js'
import MiddleSection from '../../pages/Home/MiddleSection';
import React from 'react'
import DM from '../../pages/DM/index.js';
export default function MainPane() {
  const { pathname } = useLocation()
  const containerElement = useRef(null);

  useEffect(() => {
    containerElement.current.scrollTop = 0
  }, [pathname])

  return (
    <div ref={containerElement} className="main-pane-container">
      <div className="main-pane">
        <Routes>
          <Route path="/*" element={<MainContainer />} />
          <Route path="/messages" element={<DMContainer />} />

        </Routes>
      </div>
    </div>

  )
}

function MainContainer() {
  return (
    <React.Fragment>
      <MiddleSection />
      <RightSection />
    </React.Fragment>
  )
}

function DMContainer() {
  return (
    <React.Fragment>
      <DM />
    </React.Fragment>
  )
}