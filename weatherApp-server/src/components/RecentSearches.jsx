import React, { useEffect } from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom'
function RecentSearches() {

  const [recentSearches, setRecentSearches] = useState([]);
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState(false);

  useEffect(async () => {
    try {
      var recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
      if(recentSearches == null) recentSearches = [];
      setRecentSearches(recentSearches);

    } catch (e) {
        console.error(e);
    }
 
 
}, []);
  return (
    <div>
      <h1 className="app-name">
      Recent Searches<span>🌤</span>
      </h1>
    
      <div className="search-bar">
      <input
          type="text"
          className="city-search"
          placeholder="Search..."
          name="city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              setSearch(true)
            }
          }}
        />
      </div>
      <Link className="des-wind"   onClick={() => {window.location.href="/"}} to="/">Weather App</Link>
        <table id="serches">
           <thead>
              <tr>
                <td>city</td>
                <td>temp</td>
                <td>lat</td>
                <td>lon</td>
              </tr>
           </thead>
           <tbody>  
  
              {
             search==true?recentSearches.filter(element => element.city.toLowerCase().includes(city.toLowerCase())).map(function (element) {
              return <tr>
               <td>{element.city}</td>
               <td>{element.temp}</td>
               <td>{element.lat}</td>
               <td>{element.lon}</td>
              </tr>;
           }):
                  recentSearches.map(function (element) {
                     return <tr>
                      <td>{element.city}</td>
                      <td>{element.temp}</td>
                      <td>{element.lat}</td>
                      <td>{element.lon}</td>
                     </tr>;
                  })
              }
           </tbody>
        </table>


    
      

     
  
         
     
   
    </div>
  )
}

export default RecentSearches;
