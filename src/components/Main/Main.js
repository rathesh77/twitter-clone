import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Timeline from './MiddleSection/Timeline/Timeline.js';
import ViewTweet from './MiddleSection/Tweet/ViewTweet.js';
import Profile from './MiddleSection/UserProfile/Profile.js';
import RightSection from './RightSection/Main.js'

export default function MainPane() {
  const { search, pathname } = useLocation()
  return (
    <Routes>
      <Route path="/" element={<Container />}>
        <Route
          path="tweet"
          element={<ViewTweet key={search}/>}
        />
        <Route path='' element={<Timeline />}/>
        <Route path=':name' element={<Profile key={pathname} />}/>
      </Route>
    </Routes>


  )
}

function Container() {

  return (
    <div className="main-pane-container">
      <div className="main-pane">
        <div className='middle-section'>
          <Outlet />
        </div>
        <RightSection />
      </div>
    </div>

  )
}