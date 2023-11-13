import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import api from "./api";

function App(){
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMakes = async () => {
      setLoading(true);
      try {
        const response = await api.get('/cars');
        // Axios automatically parses the response body to JSON
        const allMakes = [...new Set(response.data.map(car => car.make))];
        setMakes(allMakes);
      } catch (error) {
        console.error('Failed to fetch makes', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMakes();
  }, []);
  
  useEffect(() => {
    const fetchFamilies = async () => {
      if (!selectedMake) {
        setFamilies([]);
        return;
      }
  
      setLoading(true);
      try {
        const response = await api.get(`/cars?make=${selectedMake}`);
        // Axios automatically parses the response body to JSON
        const makeFamilies = [...new Set(response.data.map(car => car.family))];
        setFamilies(makeFamilies);
      } catch (error) {
        console.error(`Failed to fetch families for make: ${selectedMake}`, error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFamilies();
  }, [selectedMake]);

  return (
    <div>
      <Autocomplete
        options={makes}
        loading={loading}
        value={selectedMake}
        onChange={(event, newValue) => {
          setSelectedMake(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Make" variant="outlined" />}
      />
      <Autocomplete
        options={families}
        loading={loading}
        disabled={!selectedMake}
        renderInput={(params) => <TextField {...params} label="Family" variant="outlined" />}
      />
    </div>
  );
};

export default App;