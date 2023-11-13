import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import api from "./api";

function App(){
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [minYear, setMinYear] = useState(null);
  const [maxYear, setMaxYear] = useState(null);
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
      if (selectedMake) {
        setLoading(true);
        try {
          const response = await api.get(`/cars?make=${selectedMake}`);
          const familiesData = response.data.map(car => car.family);
          setFamilies([...new Set(familiesData)]); // Remove duplicates
          console.log('Families fetched:', familiesData); // Debug log
        } catch (error) {
          console.error(`Failed to fetch families for make: ${selectedMake}`, error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchFamilies();
  }, [selectedMake]);

  useEffect(() => {
    // Fetch min and max years based on selected make and family
    const fetchYears = async () => {
      if (selectedMake && selectedFamily) {
        setLoading(true);
        try {
          const response = await api.get(`/cars?make=${selectedMake}&family=${selectedFamily}`);
          const yearsData = response.data.map(car => parseInt(car.year, 10)).filter(Boolean);
          setMinYear(Math.min(...yearsData));
          setMaxYear(Math.max(...yearsData));
        } catch (error) {
          console.error(`Failed to fetch years for make: ${selectedMake} and family: ${selectedFamily}`, error);
        } finally {
          setLoading(false);
        }
      } else {
        setMinYear(null);
        setMaxYear(null);
      }
    };

    fetchYears();
  }, [selectedMake, selectedFamily]);

  const handleYearChange = (event, newValue) => {
    console.log('Selected Year Range:', newValue);
  };

  useEffect(() => {
    console.log(`Selected Make: ${selectedMake}, Selected Family: ${selectedFamily}`);
    console.log(`Min Year: ${minYear}, Max Year: ${maxYear}`);
    console.log(`Slider Disabled: ${!selectedMake || !selectedFamily || minYear === null || maxYear === null}`);
  }, [selectedMake, selectedFamily, minYear, maxYear]);

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
        onChange={(event, newValue) => {
          setSelectedFamily(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Family" variant="outlined" />}
      />
      <Typography id="year-slider" gutterBottom>
        Year Range
      </Typography>
      <Slider
        value={typeof minYear === 'number' && typeof maxYear === 'number' ? [minYear, maxYear] : [0, 0]}
        onChange={handleYearChange}
        valueLabelDisplay="auto"
        aria-labelledby="year-slider"
        getAriaValueText={(value) => `${value}`}
        min={minYear}
        max={maxYear}
        disabled={!selectedMake || !selectedFamily || minYear === null || maxYear === null}
      />

      {/* When you want to show the selected range outside the slider */}
      <Box sx={{ mt: 2 }}>
        <Typography>
          Selected range: {minYear} - {maxYear}
        </Typography>
      </Box>
    </div>
  );
};

export default App;