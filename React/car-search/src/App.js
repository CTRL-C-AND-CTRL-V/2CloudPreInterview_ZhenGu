import React, { useState, useEffect } from 'react';
import { Grid, Box,Container, Typography, Slider, TextField, Autocomplete, styled} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./mycss.css"
import api from "./api";

function App(){
  const [cars, setCars] = useState([]);
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
  const [sort,setSort] = useState(null);
  const [order, setOrder] = useState(null);
  const sortOption = ['Sale Date', 'Age','Odometer'];
  const orderOption = ['Asc', 'Desc'];

  const [isDivVisible, setIsDivVisible] = useState(false);

  const [isYearOpen, setYearOpen] = useState(false);
  const [isodoOpen, setodoOpen] = useState(false);
  
  // Toggle the custom box display
  const toggleYearBox = () => {
    setYearOpen(!isYearOpen);
  };

  const toggleOdoBox = () => {
    setodoOpen(!isodoOpen);
  };

  const [loading, setLoading] = useState(false);

  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            height:'0px',
            fontSize:'0.8rem',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: 'white', 
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.8rem',
            color:'black',
            top:'-7px',
          },
        },
      }
    },
  });

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
          const odometerData = carsData.map(car => car.odometer).filter(Boolean);
          const uniqueOdometerData = [...new Set(odometerData)].sort((a, b) => a - b);

          const uniqueEngines = [...new Set(carsData.map(car => car.engine).filter(Number.isFinite))];
          const uniqueCylinders = [...new Set(carsData.map(car => car.cylidners).filter(Number.isFinite))];
          const uniqueSeats = [...new Set(carsData.map(car => car.seat).filter(Number.isFinite))];
          const uniqueDoors = [...new Set(carsData.map(car => car.doors).filter(Number.isFinite))];


          if (uniqueYearData.length > 0) {
            setYear([uniqueYearData[0], uniqueYearData[uniqueYearData.length - 1]]);
            setYearMinMax([uniqueYearData[0], uniqueYearData[uniqueYearData.length - 1]]);
          }

          if (uniqueOdometerData.length > 0) {
            setOdometer([uniqueOdometerData[0], uniqueOdometerData[uniqueYearData.length - 1]]);
            setOdometerMinMax([uniqueOdometerData[0], uniqueOdometerData[uniqueYearData.length - 1]]);
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
    setYear(newValue);
  };

  const handleodoChange = (event, newValue) => {
    setOdometer(newValue);
  };

  const totalOdometerReadings = cars.reduce((accumulator, car) => {
    return accumulator + car.odometer; // Assuming car.odometer is a number
  }, 0);
  
  const averageOdometerReading = cars.length > 0 ? Math.round(totalOdometerReadings / cars.length) : 0;

  const applyFilter = async () => {
    // Collect all input field data
    const filterParams = {
      make: selectedMake,
      family: selectedFamily,
      year_start: year[0],
      year_end: year[1],
      odometer_start: odometer[0],
      odometer_end:odometer[1],
      badges: badgesSelected,
      bodyType: bodyTypeSelected,
      bodyTypeConfig: bodyTypeConfigSelected,
      fuelType:fuelTypeSelected,
      transmission:transmissionSelected,
      engine:engineSelected,
      cylinders:cylindersSelected,
      division:divisionSelected,
      drive:driveSelected,
      seat:seatSelected,
      doors:doorsSelected,
      state: stateSelected,
      saleCategory:saleCategorySelected
    };
  
    // Construct query string
    const queryString = Object.entries(filterParams)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  
    // Send request to API
    try {
      const response = await api.get(`/cars/filtered?${queryString}`);
      setCars(response.data);
      console.log('Filtered data:', response.data);
      setIsDivVisible(true);
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
    setBadgesSelected(null);
    setBodyTypeSelected(null);
    setBodyTypeConfigSelected(null);
    setFuelTypeSelected(null);
    setTransmissionSelected(null);
    setEngineSelected(null);
    setCylindersSelected(null);
    setDivisionSelected(null);
    setDriveSelected(null);
    setSeatSelected(null);
    setDoorsSelected(null);
    setOdometer([]);
    setOdometerMinMax([]);
    setStateSelected(null);
    setSaleCategorySelected(null);

    setIsDivVisible(false);
  };

  const generateLable = (input) => {
    const[min, max] = input;
    if (min && max){
      return `${min}|${max}`
    }
    return `${input}`;
  }

  const CarListItem = ({ car }) => {
    return (
      <div className="car-list-item">
        <div style={{display:'flex',flexDirection:'column'}}>
          <p style={{margin:"0px"}}><strong className="highlight">{car.make} {car.family} {car.year} </strong> {car.badges} {car.engine}T</p>
          <div className='greyDetail'>
            <div className='grey'>{car.saleCategory}</div>
            <div className='grey'>{car.odometer} Kms</div>
            <div className='grey'>Sold in {car.state} ({car.state})</div>
            <div style={{marginRight:'20px'}}>Condition</div>
            <div > Sold in {car.saleDate}</div>
          </div>
        </div>
        <div className="car-actions">
          <button className='mybtn2'>Subscribe to Reveal Price</button>
          <button className="mybtn4">See More</button>
        </div>
      </div>
    );
  };

  return (
    <div className='background'>
    <Container maxWidth="md" style={{marginTop:'2%'}}>
      <Typography>
        <h1>Search Used Car Prices</h1>
      </Typography>
      <Grid container spacing={1}>
        <ThemeProvider theme={theme}>
        <Grid item md={1.7}>
          <Autocomplete className='autocomplete'
          options={makes}
          loading={loading}
          value={selectedMake}
          onChange={(event, newValue) => {
            setSelectedMake(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Make" variant="outlined" />}
        />
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
          options={families}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setSelectedFamily(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Family" variant="outlined" />}
          />
        </Grid>
        <Grid item md = {1.7}>
          <TextField
            disabled={!selectedMake&&!selectedFamily}
            label= {generateLable(year)}
            onClick={toggleYearBox} // Handle click to toggle custom box
            open={false} // Keep the dropdown always closed
          />
          {isYearOpen && (
            <Box className="yearBox">
              <Slider
                style={{width:"150px"}}
                size='small'
                value={year}
                onChange={handleYearChange}
                valueLabelDisplay="auto"
                aria-labelledby="year-slider"
                getAriaValueText={(value) => `${value}`}
                min={yearMinMax[0]}
                max={yearMinMax[1]}
                step={1}
                // dis
                abled={!selectedMake || !selectedFamily || year === null }
              />
              <p style={{fontSize:'0.8rem'}}>
                Selected range: {year[0]} - {year[1]}
              </p>
            </Box>
          )}
        </Grid>
        <Grid item md = {1.7}>
          <Autocomplete
          options={badges}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setBadgesSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Badges" variant="outlined" />}
          />
        </Grid>
        <Grid item md = {1.7}>
          <Autocomplete
          options={bodyType}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setBodyTypeSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Body Type" variant="outlined" />}
          />
        </Grid>
        <Grid item md = {1.7}>
          <Autocomplete
          options={bodyTypeConfig}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setBodyTypeConfigSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Body Type Config" variant="outlined" />}
          />
        </Grid>
        <Grid item md = {1.7}>
          <Autocomplete
          options={fuelType}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setFuelTypeSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Fuel Type" variant="outlined" />}
          />
        </Grid>

        <Grid item md={1.7}>
          <Autocomplete
          options={transmission}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setTransmissionSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Transmission" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
          options={engine}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setEngineSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Engine" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
          options={cylidners}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setCylindersSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Cylinders" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
            options={division}
            loading={loading}
            disabled={!selectedMake}
            onChange={(event, newValue) => {
              setDivisionSelected(newValue); // This sets the selectedFamily state
            }}
            renderInput={(params) => <TextField {...params} label="Division" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
          options={drive}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setDriveSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Drive" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
          options={seat}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setSeatSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Seat" variant="outlined" />}
          />     
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
            options={doors}
            getOptionLabel={(option) => option.toString()}
            loading={loading}
            disabled={!selectedMake}
            onChange={(event, newValue) => {
              setDoorsSelected(newValue); // This sets the selectedFamily state
            }}
            renderInput={(params) => <TextField {...params} label="Doors" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1.7}>
          <TextField
            disabled={!selectedMake}
            label= {generateLable(odometer)}
            onClick={toggleOdoBox} // Handle click to toggle custom box
            open={false} // Keep the dropdown always closed
          />
          {isodoOpen && (
            <Box className="yearBox">
              <Slider
                style={{width:"150px"}}
                size='small'
                value={odometer}
                onChange={handleodoChange}
                valueLabelDisplay="auto"
                aria-labelledby="year-slider"
                getAriaValueText={(value) => `${value}`}
                min={odometerMinMax[0]}
                max={odometerMinMax[1]}
                step={1}
                // dis
                abled={!selectedMake || !selectedFamily || year === null }
              />
              <p style={{fontSize:'0.8rem'}}>
                Selected range: {odometer[0]} - {odometer[1]}
              </p>
            </Box>
          )}
        </Grid>
        <Grid item md={1.7}>
        <Autocomplete
          options={state}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setStateSelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="State" variant="outlined" />}
          />
        </Grid>
        <Grid item md={1.7}>
          <Autocomplete
          options={saleCategory}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setSaleCategorySelected(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Sale Category" variant="outlined" />}
          />
        </Grid>
        <Grid item md = {1.7}>
          <Autocomplete
          options={saleDate}
          loading={loading}
          disabled={!selectedMake}
          onChange={(event, newValue) => {
            setSaleDate(newValue); // This sets the selectedFamily state
          }}
          renderInput={(params) => <TextField {...params} label="Sale Date" variant="outlined" />}
          />
        </Grid>
        <Grid item md = {1.7}>
          <Autocomplete
            options={sortOption}
            loading={loading}
            onChange={(event, newValue) => {
              setSort(newValue); 
            }}
            renderInput={(params) => <TextField {...params} label="Sort" variant="outlined" />}
          />
        </Grid>
        <Grid item md = {1.7}>
          <Autocomplete
              options={orderOption}
              loading={loading}
              onChange={(event, newValue) => {
                setOrder(newValue); 
              }}
              renderInput={(params) => <TextField {...params} label="Order" variant="outlined" />}
          />
        </Grid>

        <Grid item md = {5}>
          <input className='myinput'  placeholder='e.g. Metallic Paint, Power front seats, Power Sunroof, ...'/>
        </Grid>
        <Grid item md = {1.5}>
          <button className= 'mybtn'onClick={applyFilter}>Apply Filter</button>
        </Grid>
        <Grid item md = {1.5}>
          <button className= 'mybtn' onClick={clearFilter}>Clear Filter</button>
        </Grid>
        <Grid item md = {4}>
          <button className= 'mybtn2' onClick={clearFilter}>Subscribe to Generate Summary Report</button>
        </Grid>
        <Grid item md = {12}>
          {isDivVisible && 
          <div className='mytext2'>
            <div className='blue'>{selectedMake} {selectedFamily} status:</div>
            <div className='second'> Record: {cars.length}</div>
            <div className='second'>Avg Price: {averageOdometerReading} kms</div>
            <div className='second'>Avg Age: </div>
            <div></div>
          </div>}
        </Grid>
        <Grid item md = {12}>
          <div className='mytext'>
            <div>Need a Prices People Pay Valuation Report?</div>
            <button className='mybtn3'> Get One Now</button>
          </div>
        </Grid>
        <Grid item md = {12}>
          {cars.map((car) => (
            <CarListItem key={car.id} car={car} /> // Render each car using a CarListItem component
          ))}
        </Grid>
        </ThemeProvider>
      </Grid>
      
    </Container>
    </div>
  );
};

export default App;