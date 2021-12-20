import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom'
import UtilsService from '../UtilService';
import { AutoComplete } from "@progress/kendo-react-dropdowns";

function Weather() {
  const [query, setQuery] = useState();
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const [Fgrad, setFgrad] = useState(false);
  const [sign, setSign] = useState('C');
  const [status, setStatus] = useState(null);
  const [matches, setMatches] = useState([]);
  const [state, setState] = React.useState({
    value: "",
    suggest: "",
  });

  const utilsService = new UtilsService();


  const getLocation = () => {
      if (!navigator.geolocation) {
        setStatus('Geolocation is not supported by your browser');
      } else {
        setStatus('Locating...');
        navigator.geolocation.getCurrentPosition((position) => {
          setStatus(null);
          console.log(position);
         
          //searchByCity();
          searchByLocation(position.coords.latitude,position.coords.longitude);
        }, () => {
          setStatus('Unable to retrieve your location');
        });
      }
    }

    async function addToFevorite(city,temp) {
      //Check if city is exist
      //setCompleted(true)
      let s = await utilsService.addItem(
        "https://localhost:44306/api/Weather/AddCityTemp",
        {                  
          "City":city,
          "Temp":temp
      }
      );
      console.log(s);
    }

    useEffect(async () => {
      try {
        //
          getLocation();
     
      } catch (e) {
          console.error(e);
      }
   
   
  }, []);
 

  const toDate = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'Nocvember',
      'December',
    ];
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()}${
      months[currentDate.getMonth()]
    } ${currentDate.getHours()}:${currentDate.getMinutes()}`;
    return date;
  };

  const searchByCity = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setQuery('');
      setWeather({ ...weather, loading: true });
      utilsService.getItemByName("https://localhost:44306/api/Weather?",'city='+query)

        .then((res) => {
          console.log('res', res);
          setWeather({ data: {'city':res.City,'temp':res.Temp,'main':'true'}, loading: false, error: false });
  
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setQuery('');
          console.log('error', error);
        });
    }
  };
  
  const searchByLocation = async (lat,lon,event) => {
    setWeather({ ...weather, loading: true });
    utilsService.getItemByName("https://localhost:44306/api/Weather?",'lat='+lat+'&lon='+lon)

      .then((res) => {
        console.log('res', res);
        setWeather({ data: {'city':res.City,'temp':res.Temp,'main':'true'}, loading: false, error: false });

      })
      .catch((error) => {
        setWeather({ ...weather, data: {}, error: true });
        setQuery('');
        console.log('error', error);
      });
  
  };

 

const onChangeHandler=(event)=>{

  setQuery(event.value)
    utilsService.getItems("https://localhost:44306/api/Weather?search="+event.value).then(data =>setMatches(data))
    .catch((error) => {
      console.log('error', error);
    });

  console.log(matches)
 
  setState({
    value: event.value,
    suggest: event.suggestion ? event.suggestion.value : "",
  });

}


  return (
    <div>
{query=='n'&&<div className="col-xs-12 col-sm-6 example-col">
        
        <AutoComplete
          data={matches}
          suggest={state.suggest}
          placeholder="auto complete city"
          value={state.value}
          onChange={onChangeHandler}        />
      </div>
}
      <h1 className="app-name">
        Weather App<span>🌤</span>
      </h1>
      <div className="search-bar">
      <input
          type="text"
          className="city-search"
          placeholder="Search another city.."
          name="query"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          onKeyPress={searchByCity}
          data={matches}
          suggest={state.suggest}
        />
      </div>
      <Link className="des-wind" onClick={() => {window.location.href="/favorites"}}  to='/favorites'>Favorites</Link>
      {weather.loading && (
        <>
          
          <br />
          <Loader type="Oval" color="black" height={100} width={100} />
        </>
      )}
      {weather.error && (
        <>
          <br />
          <br />

          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ 'font-size': '20px' }}> Sorry, City not found</span>
          </span>
        </>
      )}

      {weather && weather.data && weather.data.main && (
        <div>
          <button className="des" onClick={()=>{addToFevorite(weather.data.city,Math.round(weather.data.temp))}}>Add To Favorites </button>

          <div className="city-name">
            <h2>
              {weather.data.city}
            </h2>
          </div>
          <div className="date">
            <span>{toDate()}</span>
          </div>
          <div className="icon-temp">
         
            {Fgrad==false?Math.round(weather.data.temp):((weather.data.temp * 9 / 5) + 32).toFixed(2)}
            <sup className="deg">&deg;{sign}</sup>
            <button className="des" onClick={()=>{setFgrad(!Fgrad);Fgrad==true?setSign('C'):setSign('F')}}>F/C </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
