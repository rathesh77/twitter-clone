import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../axios";
import Suggestion from "./Suggestion";

export default function ListSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  
  useEffect(()=>{
    (async()=>{
      const suggestions = await axiosInstance.get('/suggestions')
      console.log(suggestions.data)
      setSuggestions(suggestions.data)
    })()

  }, [])
  
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
