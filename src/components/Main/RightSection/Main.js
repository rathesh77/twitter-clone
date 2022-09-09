import { TextField, Paper } from '@mui/material'
import ListTrends from './Trend/ListTrends';
import ListSuggestions from './Suggestion/ListSuggestions';

export default function RightSection() {
  return (
    <div className="right-section">
      <TextField id="outlined-basic" label="Rechercher sur Twitter" variant="outlined" sx={{marginBottom: '10px', width: '100%'}} />
      <Paper elevation={1} sx={{ padding: '15px 20px 15px 20px' }}>
        <ListTrends />
      </Paper>
      <Paper elevation={1} sx={{ padding: '15px 20px 15px 20px' }}>
        <ListSuggestions />
      </Paper>

    </div>
  );
}
