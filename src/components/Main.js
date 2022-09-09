import LeftPane from './Menu/LeftPane'
import MainPane from './Main/Main'
export default function Main() {
  return (
    <div className='main-container'>
      <LeftPane/>
      <MainPane/>
    </div>
  )
}