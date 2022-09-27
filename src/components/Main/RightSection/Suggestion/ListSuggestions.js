import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../axios";
import Suggestion from "./Suggestion";

export default function ListSuggestions() {
  const [suggestions, setSuggestions] = useState(null)
  
  useEffect(()=>{
    if (suggestions != null) {
      console.log('render')
      const event = new Event('rendered')
      document.dispatchEvent(event)
      return
    }
    (async()=>{
      const suggestions = await axiosInstance.get('/suggestions')
      setSuggestions(suggestions.data)
    })()

  }, [suggestions])
  if (suggestions == null) {
    return <div></div>
  }
  return (
    <List className="suggestions">
      <div className="right-section-title">Vous pourriez aimer</div>
      {suggestions.map((s)=>{
        const {uid} = s._fields[1].properties
        return (
          <ListItem key={uid} disablePadding>
        <Suggestion setSuggestions={setSuggestions}
          user={s._fields[1].properties}
        />
      </ListItem>
        )
      })}
      <br />
      <a href="test" className="see-more">
        Voir plus
      </a>
    </List>
  );
}
