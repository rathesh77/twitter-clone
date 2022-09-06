import LeftPane from './LeftPane'
import MainPane from './MainPane'
//import RightPane from './RightPane.js'
export default function Main() {
  return (
    <div className='main-container'>
      <LeftPane/>
      <MainPane/>
    </div>
  )
}