import React, { useState } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function App() {
  // State for each filter
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  // ... other states for filters

  const handleApplyFilter = () => {
    // Logic to apply filters
  };

  const handleClearFilter = () => {
    // Logic to clear filters
  };

  const makeop = ['Audi','BMW'];
  const familyop = ['A1', 'A3'];
  const yearop = ['1990', '1991']


  return (
    <div className="App">
      <nav>
        {/* Navbar component */}
      </nav>
      <main>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={makeop}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Make" />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={familyop}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Family" />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={yearop}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Year" />}
        />
        <section className="search-filters">
          {/* Dropdowns and input fields */}
          <button onClick={handleApplyFilter}>Apply Filter</button>
          <button onClick={handleClearFilter}>Clear Filter</button>
        </section>
        <section className="stats-display">
          {/* Display stats */}
        </section>
      </main>
    </div>
  );
}

export default App;