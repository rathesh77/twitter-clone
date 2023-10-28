import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useEffect, useState } from "react";
import { fetchSuggestions } from "../../services/userServices";
import Suggestion from "../Suggestion";

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
      const suggestions = await fetchSuggestions()
      if (suggestions)
        setSuggestions(suggestions)
    })()

  }, [suggestions])
  if (suggestions == null) {
    return <div></div>
  }
  return (
    <List className="suggestions">
      <div className="right-section-title">Vous pourriez aimer</div>
      {suggestions.map((s)=>{
        const uid = s.uid
        return (
          <ListItem key={uid} disablePadding>
        <Suggestion setSuggestions={setSuggestions}
          user={s}
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
