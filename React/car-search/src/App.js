import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import api from "./api";

function App(){
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState([]);
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [year,setYear] = useState([]);
  const [yearMinMax, setYearMinMax] = useState([]);
  const [badges, setBadges] = useState([]);
  const [bodyType, setBodyType] = useState([]);
  const [bodyTypeConfig, setBodyTypeConfig] = useState([]);
  const [fuelType, setFuelType] = useState([]);
  const [transmission, setTransmission] = useState([]);
  const [engine, setEngine] = useState([]); 
  const [cylidners, setcylidners] = useState([]); 
  const [division, setDivision] = useState([]);
  const [drive, setDrive] = useState([]);
  const [seat, setSeat] = useState([]); 
  const [doors, setDoors] = useState([]);
  const [odometer, setOdometer] = useState([]);
  const [odometerMinMax, setOdometerMinMax] = useState([]);
  const [state, setState] = useState([]);
  const [saleCategory, setSaleCategory] = useState([]);
  const [saleDate, setSaleDate] = useState([]);

  const [badgesSelected, setBadgesSelected] = useState(null);
  const [bodyTypeSelected, setBodyTypeSelected] = useState(null);
  const [bodyTypeConfigSelected, setBodyTypeConfigSelected] = useState(null);
  const [fuelTypeSelected, setFuelTypeSelected] = useState(null);
  const [transmissionSelected, setTransmissionSelected] = useState(null);
  const [engineSelected, setEngineSelected] = useState(null);
  const [cylindersSelected, setCylindersSelected] = useState(null); // Corrected the spelling here
  const [divisionSelected, setDivisionSelected] = useState(null);
  const [driveSelected, setDriveSelected] = useState(null);
  const [seatSelected, setSeatSelected] = useState(null);
  const [doorsSelected, setDoorsSelected] = useState(null);
  const [stateSelected, setStateSelected] = useState(null);
  const [saleCategorySelected, setSaleCategorySelected] = useState(null);
  const [saleDateSelected, setSaleDateSelected] = useState(null);

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
    const fetchData = async () => {
      if (selectedMake && selectedFamily) {
        setLoading(true);
        try {
          const response = await api.get(`/cars?make=${selectedMake}&family=${selectedFamily}`);
          const carsData = response.data;
  
          // Assuming each car object in the response has all the fields we're interested in
          const yearData = carsData.map(car => car.year).filter(Boolean);
          const uniqueYearData = [...new Set(yearData)].sort((a, b) => a - b);
          const uniqueEngines = [...new Set(carsData.map(car => car.engine).filter(Number.isFinite))];
          const uniqueCylinders = [...new Set(carsData.map(car => car.cylinders).filter(Number.isFinite))];
          const uniqueSeats = [...new Set(carsData.map(car => car.seat).filter(Number.isFinite))];
          const uniqueDoors = [...new Set(carsData.map(car => car.doors).filter(Number.isFinite))];
          if (uniqueYearData.length > 0) {
            setYear([uniqueYearData[0], uniqueYearData[uniqueYearData.length - 1]]);
            setYearMinMax([uniqueYearData[0], uniqueYearData[uniqueYearData.length - 1]]);
          }
  
          // Mapping and setting state for each attribute
          setBadges([...new Set(carsData.map(car => car.badges).filter(Boolean))]);
          setBodyType([...new Set(carsData.map(car => car.bodyType).filter(Boolean))]);
          setBodyTypeConfig([...new Set(carsData.map(car => car.bodyTypeConfig).filter(Boolean))]);
          setFuelType([...new Set(carsData.map(car => car.fuelType).filter(Boolean))]);
          setTransmission([...new Set(carsData.map(car => car.transmission).filter(Boolean))]);
          setEngine(uniqueEngines);
          setcylidners(uniqueCylinders);
          setDivision([...new Set(carsData.map(car => car.division).filter(Boolean))]);
          setDrive([...new Set(carsData.map(car => car.drive).filter(Boolean))]);
          setSeat(uniqueSeats);
          setDoors(uniqueDoors);
          // setOdometer(carsData.map(car => car.odometer).filter(Boolean));
          // setOdometerMinMax([Math.min(...carsData.map(car => car.odometer)), Math.max(...carsData.map(car => car.odometer))]);
          setState([...new Set(carsData.map(car => car.state).filter(Boolean))]);
          setSaleCategory([...new Set(carsData.map(car => car.saleCategory).filter(Boolean))]);
          // setSaleDate(carsData.map(car => car.saleDate).filter(Boolean));
  
        } catch (error) {
          console.error(`Failed to fetch data for make: ${selectedMake} and family: ${selectedFamily}`, error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchData();
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

      <Autocomplete
        options={badges}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setBadgesSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Badges" variant="outlined" />}
      />
      <Autocomplete
        options={bodyType}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setBodyTypeSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Body Type" variant="outlined" />}
      />
      <Autocomplete
        options={bodyTypeConfig}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setBodyTypeConfigSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Body Type Config" variant="outlined" />}
      />
      <Autocomplete
        options={fuelType}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setFuelTypeSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Fuel Type" variant="outlined" />}
      />
      <Autocomplete
        options={transmission}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setTransmissionSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Transmission" variant="outlined" />}
      />
      <Autocomplete
        options={engine}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setEngineSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Engine" variant="outlined" />}
      />
      <Autocomplete
        options={cylidners}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setCylindersSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Cylinders" variant="outlined" />}
      />
      <Autocomplete
        options={division}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setDivisionSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Division" variant="outlined" />}
      />
      <Autocomplete
        options={drive}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setDriveSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Drive" variant="outlined" />}
      />
      <Autocomplete
        options={seat}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setSeatSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Seat" variant="outlined" />}
      />
      <Autocomplete
        options={doors}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setDoorsSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Doors" variant="outlined" />}
      />
      <Autocomplete
        options={odometer}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setOdometer(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Odometer" variant="outlined" />}
      />
      <Autocomplete
        options={state}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setStateSelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="State" variant="outlined" />}
      />
      <Autocomplete
        options={saleCategory}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setSaleCategorySelected(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Sale Category" variant="outlined" />}
      />
      <Autocomplete
        options={saleDate}
        loading={loading}
        disabled={!selectedMake}
        onChange={(event, newValue) => {
          setSaleDate(newValue); // This sets the selectedFamily state
        }}
        renderInput={(params) => <TextField {...params} label="Sale Date" variant="outlined" />}
      />
      <button onClick={applyFilter}>Apply Filter</button>
      <button onClick={clearFilter}>Clear Filter</button>
    </div>
  );
};

export default App;