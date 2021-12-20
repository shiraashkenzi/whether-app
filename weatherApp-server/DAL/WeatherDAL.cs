using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class WeatherDAL
    {
        public static int GetMaxId()
        {
            using (WeatherEntities1 weather = new WeatherEntities1())
            {
                return weather.CityTemp.Count()>0? weather.CityTemp.Max(c => c.ID):0;
            }
        }

        public static void AddCityTemp(CityTemp newCityTemp)
        {
            using (WeatherEntities1 weather = new WeatherEntities1())
            {
                CityTemp favoriteCity = new CityTemp();
                favoriteCity = weather.CityTemp.ToList().FirstOrDefault(c => c.city.ToString().Equals(newCityTemp.city.ToString()));
                weather.SaveChanges();
                if (favoriteCity == null)
                {
                weather.CityTemp.Add(newCityTemp);                 
                weather.SaveChanges();
                   
                }

                //If the value exists in DB but is not up to date. Update the value
                else if (favoriteCity.date.Day != newCityTemp.date.Day)
                {
                weather.CityTemp.Remove(favoriteCity); 
                weather.CityTemp.Add(newCityTemp);    
                weather.SaveChanges();
                }
            }
        }

        public static IEnumerable<CityTemp> GetAllCityTemps()
        {
            using (WeatherEntities1 weather = new WeatherEntities1())
            {
                return weather.CityTemp.ToList();
            }
        }

        public static CityTemp GetCityTemp(string city)
        {
            using (WeatherEntities1 weather = new WeatherEntities1())
            {
                return weather.CityTemp.ToList().FirstOrDefault(c => c.city.ToString()==city.ToString());
            }
        }
    }
}
