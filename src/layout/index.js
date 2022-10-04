import LeftPane from './Menu'
import MainPane from './Container/index'
export default function Main() {
  return (
    <div className='main-container'>
      <LeftPane/>
      <MainPane/>
    </div>
  )
}