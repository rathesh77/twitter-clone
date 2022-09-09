import { useState } from 'react';
export default function Trend(props) {
  const [text] = useState(props.title)
  const [category] = useState('default')
  const [tweetsCount] = useState(0)

  return (
    <div className="trend">
        <div className='trend-category'>{category}</div>
        <div className='trend-title'>{text}</div>
        <div className='trend-tweets-count'>{tweetsCount} tweets</div>
    </div>
  );
}
