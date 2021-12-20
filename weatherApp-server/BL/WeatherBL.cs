using BL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using System.Net.Http;
using System.Net;
using System.IO;
using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
namespace BL
{
    public static class WeatherBL
    {


        public static void AddCityTemp(Models.CityTemp cityTemp)
        {
            DAL.CityTemp newCityTemp = new DAL.CityTemp();
            newCityTemp.ID = WeatherDAL.GetMaxId()+1;
            newCityTemp.date = DateTime.Now;
            newCityTemp.city = cityTemp.City;
            newCityTemp.temp = cityTemp.Temp;
            WeatherDAL.AddCityTemp(newCityTemp);  
        }

        public static IEnumerable<Models.CityTemp> GetAllCityTempsFromDB()
        {
            IEnumerable<DAL.CityTemp> cityTemps = WeatherDAL.GetAllCityTemps();
            foreach (DAL.CityTemp item in cityTemps)
            {
                Models.CityTemp citytemp = new Models.CityTemp();
                citytemp.City = item.city;
                citytemp.Temp = (float)item.temp;
                citytemp.Date = item.date;
                yield return citytemp;
            }
        }

        public static CityTempAPI GetCityTemp(string city)
        {
            DAL.CityTemp c = null;
            CityTempAPI ct = new CityTempAPI();

            //Check if the requested weather is already in the favorites
            c=WeatherDAL.GetCityTemp(city);   
          

            //If the search is performed by location
            //Or the requested weather is not already in the favorites 
            //Or the temperature is out of date for the search time
            //call the api
            if (c==null ||c.date.Day!=DateTime.Now.Day )
            {
                string urlParameters = "&units=metric&appid=f00c38e0279b7bc85480c3fe775d518c";
                string _address = String.Format("https://api.openweathermap.org/data/2.5/weather?q="+ city + urlParameters);
                WebResponse responseObjGet = null;
                try
                {
                    WebRequest requestObjGet = WebRequest.Create(_address);
                    requestObjGet.Method = "Get";
                    requestObjGet.ContentType = "application/json; charset=utf-8";
                    responseObjGet = (HttpWebResponse)requestObjGet.GetResponse();
                }
                catch (WebException ex)
                {
                    Console.WriteLine(ex.Response);
                    return null;
                  
                }



                string streamRes = null;

                using (Stream stream = responseObjGet.GetResponseStream())
                {
                    StreamReader st = new StreamReader(stream);
                    streamRes = st.ReadToEnd();
                    st.Close();
                }
                dynamic data = JsonConvert.DeserializeObject(streamRes);
                ct.City = data.name;
                ct.Temp = (float)data.main.temp;

            }
            else
            {
                ct.City = c.city;
                ct.Temp = (float)c.temp;
            }
            return ct;
        }

        public static CityTempAPI GetCityTemp(string lat,string lon)
        {
            DAL.CityTemp c = null;
            CityTempAPI ct = new CityTempAPI();

            //If the requested weather is not already in the favorites 
            //Or the temperature is out of date for the search time
            //call the api
                string urlParameters = "&units=metric&appid=f00c38e0279b7bc85480c3fe775d518c";
                string _address = String.Format("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="+ lon+urlParameters);
                 WebResponse responseObjGet = null;
            try
            {
                WebRequest requestObjGet = WebRequest.Create(_address);
                requestObjGet.Method = "Get";
                requestObjGet.ContentType = "application/json; charset=utf-8";
                responseObjGet = (HttpWebResponse)requestObjGet.GetResponse();              
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex.Response);
                return null;

            }
            string streamRes = null;
                using (Stream stream = responseObjGet.GetResponseStream())
                {
                    StreamReader st = new StreamReader(stream);
                    streamRes = st.ReadToEnd();
                    st.Close();
                }
                dynamic data = JsonConvert.DeserializeObject(streamRes);
                ct.City = data.name;
                ct.Temp = (float)data.main.temp;
       
            return ct;
        }



        public static IEnumerable<String> Search(string search)
        {

            string key = "90mq8xz3it6peINueyGgnJbfkHhpkXAU";
            WebResponse responseObjGet = null;
            string _address = String.Format("http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=" + key +"&q="+search);
            try { 
            WebRequest requestObjGet = WebRequest.Create(_address);
            requestObjGet.Method = "Get";
            requestObjGet.ContentType = "application/json; charset=utf-8";
            responseObjGet = (HttpWebResponse)requestObjGet.GetResponse();
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex.Response);

            }
            string streamRes = null;

            try
            {

                using (Stream stream = responseObjGet.GetResponseStream())
                {
                    StreamReader st = new StreamReader(stream);
                    streamRes = st.ReadToEnd();
                    st.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Data);
                
            }
            dynamic data = JsonConvert.DeserializeObject(streamRes);
            foreach (dynamic item in data)
                yield return  (string)item.LocalizedName;

        }
    }
}
