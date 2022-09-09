import { useState } from "react"

export default function Suggestion(props) {
  const [title] = useState(props.title)
  return (
    <span>
      {title}
    </span>
  )
}