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
  const [year,setYear] = useState([]);
  const [yearMinMax, setYearMinMax] = useState([]);
  const [loading, setLoading] = useState(false);


  /* update make */
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
  
  /* update family */
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
    const fetchYearRange = async () => {
      if (selectedMake && selectedFamily) {
        setLoading(true);
        try {
          const response = await api.get(`/cars?make=${selectedMake}&family=${selectedFamily}`);
          const yearData = response.data.map(car => car.year);
          if (yearData.length > 0) {
            setYear([Math.min(...yearData),Math.max(...yearData)]);
            setYearMinMax([Math.min(...yearData),Math.max(...yearData)]);
          }
        } catch (error) {
          console.error(`Failed to fetch year range for make: ${selectedMake} and family: ${selectedFamily}`, error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchYearRange();
  }, [selectedMake, selectedFamily]);

  const handleYearChange = (event, newValue) => {
    // newValue is an array with two elements: [min, max]
    setYear(newValue);
  };

  const applyFilter = async () => {
    // Collect all input field data
    const filterParams = {
      make: selectedMake,
      family: selectedFamily,
      yearRange: [year[0], year[1]],
      // ... any other fields you want to include
    };
  
    // Construct query string
    const queryString = Object.entries(filterParams)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  
    // Send request to your API
    try {
      const response = await api.get(`/cars/filtered?${queryString}`);
      console.log('Filtered data:', response.data);
    } catch (error) {
      console.error('Failed to fetch filtered data', error);
    }
  };
  
  const clearFilter = () => {
    // Reset all states that hold input field values
    setSelectedMake(null);
    setSelectedFamily(null);
    setYear([]);
    setYearMinMax([]);
  };

  return (
    <div style={{padding:'10%'}}>
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
        value={year}
        onChange={handleYearChange}
        valueLabelDisplay="auto"
        // aria-labelledby="year-slider"
        // getAriaValueText={(value) => `${value}`}
        min={yearMinMax[0]}
        max={yearMinMax[1]}
        step={1}
        // disabled={!selectedMake || !selectedFamily || year === null }
      />

      <Box sx={{ mt: 2 }}>
        <Typography>
          Selected range: {year[0]} - {year[1]}
        </Typography>
      </Box>

      <button onClick={applyFilter}>Apply Filter</button>
      <button onClick={clearFilter}>Clear Filter</button>
    </div>
  );
};

export default App;