import LeftPane from '../components/LeftPane'
import MainPane from './Main/index'
export default function Main() {
  return (
    <div className='main-container'>
      <LeftPane/>
      <MainPane/>
    </div>
  )
}