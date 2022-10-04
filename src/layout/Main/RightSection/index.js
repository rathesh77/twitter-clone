import { TextField, Paper, Avatar } from '@mui/material'
import ListTrends from '../../../components/List/ListTrends';
import ListSuggestions from '../../../components/List/ListSuggestions';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSearch } from '../../../services/search';

export default function RightSection() {

  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const handleSearchInput = async (e) => {
    const { value } = e.target
    if (value === '') {
      setSearchResults([])
      return
    }
    const results = await fetchSearch(value)
    const data = results
    setSearchResults(data)
  }
  const handleSearchItemClick = async (e, item) => {
    if (pathname.slice(1) !== item.username)
      navigate(`/${item.username}`, { state: { userId: item.uid } })
    setSearchResults([])
  }
  return (
    <div>
      <div className="right-section">
        <TextField onChange={handleSearchInput} id="outlined-basic" label="Rechercher sur Twitter" variant="outlined" sx={{ marginBottom: '10px', width: '100%' }} />
        <div className='search-results'>
        {searchResults.map((s) => {
          const properties = s._fields[0].properties
          return (
            <div key={properties.uid} className='search-item' onClick={(e) => { handleSearchItemClick(e, properties) }}>
              <Avatar sx={{ marginRight: "10px", marginLeft: "10px", width: "60px", height: "60px" }} src={properties.avatar} alt='Spic' />
              <div>
                <div>
                  {properties.username}
                </div>
                <div>
                  @{properties.username}
                </div>
              </div>
            </div>
          )
        })}
      </div>
        <Paper elevation={1} sx={{ padding: '15px 20px 15px 20px' }}>
          <ListTrends />
        </Paper>
        <Paper elevation={1} sx={{ padding: '15px 20px 15px 20px' }}>
          <ListSuggestions />
        </Paper>

      </div>
    </div>
  );
}
