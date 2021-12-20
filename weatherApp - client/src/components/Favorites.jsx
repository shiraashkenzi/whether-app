import React, { useEffect } from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner';
import UtilsService from '../UtilService';

function Favorites() {

  const [favorites, setFavorites] = useState([]);
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState(false);
  const utilsService = new UtilsService();


    useEffect(() => {
      utilsService.getItems("https://localhost:44306/api/Weather").then(data =>setFavorites(data))
      },[]);

  return (


    <div>
 


      <h1 className="app-name">
      Favorites<span>🌤</span>
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
      {favorites.length==0 && (
        <>
          <br />
          <br />
          <Loader type="Oval" color="black" height={100} width={100} />
        </>
      )}
           {favorites.length>0 && <div>
        <table id="serches">
           <thead>
              <tr>
                <td>city</td>
                <td>temp</td>
                <td>date</td>
              </tr>
           </thead>
           <tbody>  
  
              {
             search==true?favorites.filter(element => element.City.toLowerCase().includes(city.toLowerCase())).map(function (element) {
              return <tr>
               <td>{element.City}</td>
               <td>{element.Temp}</td>
               <td>{element.Date}</td>
              </tr>;
           }):
           favorites.map(function (element) {
                     return <tr>
                      <td>{element.City}</td>
                      <td>{element.Temp}</td>
                      <td>{element.Date}</td>
                     </tr>;
                  })
              }
           </tbody>
        </table>   
   </div>}
    </div>
  )
}

export default Favorites;
