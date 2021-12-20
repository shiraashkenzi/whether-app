using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BL.Models;
using BL;
using System.Web.Http.Cors;
//using System.Web.Http.Cors;

namespace API.Controllers
{
   
    [System.Web.Http.Cors.EnableCors("*", "*", "*")]
    public class WeatherController : ApiController
    {
        

        // GET api/<controller>
        public IEnumerable<CityTemp> Get()
        {
            return WeatherBL.GetAllCityTempsFromDB();   
        }
          [HttpGet]

        // GET api/<controller>/5
        public CityTempAPI GetCityTemp(string city)
        {
            return WeatherBL.GetCityTemp(city);
        }
        [HttpGet]

        // GET api/<controller>/5
        public CityTempAPI GetCityTempbyLatAndLon(string lat,string lon)
        {
            return WeatherBL.GetCityTemp(lat,lon);
        }
        [HttpGet]


        // GET api/<controller>/5
        public IEnumerable<string> Search(string search)
        {
            return WeatherBL.Search(search);
        }
        //[HttpGet]


        [HttpPost]
        public void AddCityTemp([FromBody] CityTemp cityTemp)
        {
            WeatherBL.AddCityTemp(cityTemp);
        }
        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}