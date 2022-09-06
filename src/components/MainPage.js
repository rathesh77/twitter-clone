import LeftPane from './LeftPane'
import FrontPane from './FrontPane'
import RightPane from './RightPane.js'
export default function MainPage() {
  return (
    <div className='main-container'>
      <LeftPane/>
      <FrontPane/>
    </div>
  )
}