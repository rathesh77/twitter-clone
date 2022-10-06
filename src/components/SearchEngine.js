import { TextField } from '@mui/material'
import { fetchSearch } from '../services/searchServices';

export default function SearchEngine(props) {

  const {setSearchResults} = props
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

  return (
    <div>
        <TextField onChange={handleSearchInput} id="outlined-basic" label="Rechercher sur Twitter" variant="outlined" sx={{ marginBottom: '10px', width: '100%' }} />
    </div>
  );
}
