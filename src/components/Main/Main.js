import MiddleSection from './MiddleSection/Main.js'
import RightSection from './RightSection/Main.js'

export default function MainPane() {
  return (
    <div className="main-pane-container">
      <div className="main-pane">
        <MiddleSection/>
        <RightSection/>
      </div>
    </div>
  )
}