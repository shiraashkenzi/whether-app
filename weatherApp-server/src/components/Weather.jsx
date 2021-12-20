import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom'

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
  
  const getLocation = () => {
      if (!navigator.geolocation) {
        setStatus('Geolocation is not supported by your browser');
      } else {
        setStatus('Locating...');
        navigator.geolocation.getCurrentPosition((position) => {
          setStatus(null);
          console.log(position);
          
          search(position.coords.latitude,position.coords.longitude);
        }, () => {
          setStatus('Unable to retrieve your location');
        });
      }
    }

    const setInLocalStorage = (testObject) => {
      var existingEntries = JSON.parse(localStorage.getItem("recentSearches"));
      if(existingEntries == null) existingEntries = [];
      
      var res=existingEntries.find(data => data.city.includes(testObject.city));
      if (res==null)
      {
      existingEntries.push(testObject);
      localStorage.setItem("recentSearches", JSON.stringify(existingEntries));
      }
    }


    useEffect(async () => {
      try {
        //
          getLocation();
         // const json = await response.json();
     
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
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const appid = 'f00c38e0279b7bc85480c3fe775d518c';

      await axios
        .get(url, {
          params: {
            q: query,
            units: 'metric',
            appid: appid,
          },
        })
        .then((res) => {
          console.log('res', res);
          setWeather({ data: res.data, loading: false, error: false });

          //set in localStorage
          var testObject ={"city":res.data.name,
                           "temp":res.data.main.temp,
                           "lat":res.data.coord.lat,
                           "lon":res.data.coord.lon };

         setInLocalStorage(testObject);
          
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setQuery('');
          console.log('error', error);
        });
    }
  };
  const search = async (lat,lon,event) => {
      setWeather({ ...weather, loading: true });
    
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const appid = 'f00c38e0279b7bc85480c3fe775d518c';

      await axios
        .get(url, {
          params: {
            lat: lat,
            lon: lon,
            units: 'metric',
            appid: appid,
          },
        })
        .then((res) => {
          console.log('res', res);
          setWeather({ data: res.data, loading: false, error: false });

         //set in localStorage
        
         var testObject ={"city":res.data.name,
                          "temp":res.data.main.temp,
                          "lat":res.data.coord.lat,
                          "lon":res.data.coord.lon };
         
            setInLocalStorage(testObject);
            })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });    
          setQuery('');
          console.log('error', error);
        }); 
  };

  return (
    <div>
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
          onChange={(event) => setQuery(event.target.value)}
          onKeyPress={searchByCity}
        />
      </div>


      <Link className="des-wind" onClick={() => {window.location.href="/recentSearches"}}  to='/recentSearches'>Recent Searches</Link>
 

      {weather.loading && (
        <>
          <br />
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
          <div className="city-name">
            <h2>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{toDate()}</span>
          </div>
          <div className="icon-temp">
            <img
              className=""
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
            {Fgrad==false?Math.round(weather.data.main.temp):((weather.data.main.temp * 9 / 5) + 32).toFixed(2)}
            <sup className="deg">&deg;{sign}</sup>
            <button className="des" onClick={()=>{setFgrad(!Fgrad);Fgrad==true?setSign('C'):setSign('F')}}>F/C </button>
          </div>
          <div className="des-wind">
            <p>{weather.data.weather[0].description.toUpperCase()}</p>
            <p>Wind Speed: {weather.data.wind.speed}m/s</p>
            <p><h4>Coordinates</h4>
            <p>Latitude: {weather.data.coord.lat}</p>
            <p>Longitude:{weather.data.coord.lon}</p></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
