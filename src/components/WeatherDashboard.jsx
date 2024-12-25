import axios from "axios";
import React, { useEffect, useState } from "react";

const WeatherDashboard = () => {
  const [weather, setWeather] = useState([]);
  const [searchedCity, setSearchedCity] = useState("");
  const [debouncing, setDebouncing] = useState(null);
  const [error, setError] = useState(""); 
  const TopFiveCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];

  // API call for getting weather details
  const fetchData = async (city) => {
    const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
    try {
      const response = await axios.get(
        `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`
      );
      return response.data;
    } catch (e) {
      setError("Failed to fetch weather data. Please try again later.");
      console.log(e);
      return null;
    }
  };

  const fetchFiveData = async () => {
    setError(""); 
    const allCitiesWeather = await Promise.all(
      TopFiveCities.map(async (city) => {
        const data = await fetchData(city);
        return data; 
      })
    );

    // Filter out any null data 
    const validWeatherData = allCitiesWeather.filter((data) => data !== null);

    // Set state with valid weather data only
    setWeather(validWeatherData);
  };

  useEffect(() => {
    fetchFiveData();
  }, []);

  // Delete button functionality
  const handleDelete = (city) => {
    const newData = weather.filter((e) => e.city !== city);
    setWeather(newData);
  };

  // Search button functionality
  const fetchNewData = async (city) => {
    const newSearchedCity = await fetchData(city);
    if (newSearchedCity && newSearchedCity.city) {
      if (newSearchedCity.city.toLowerCase() === city.toLowerCase()) {
        setWeather((prevWeather) => [newSearchedCity, ...prevWeather]);
        setError(""); // Clear any errors on successful search
      }
    } else {
      setError("City not found. Please try a different city.");
    }
  };

  const handleChange = (e) => {
    let city = e.target.value;
    setSearchedCity(city);

    if (debouncing) {
      clearTimeout(debouncing);
    }

    const timer = setTimeout(() => {
      if (city) {
        fetchNewData(city);
      }
    }, 300);

    setDebouncing(timer); // Debouncing for delaying the API calls
  };

  return (
    <>
      <div className="container-bg p-10">
        <div className="max-w-[1200px] flex flex-col align-center justify-center mx-auto">
        <h2 className="text-white text-sm sm:text-xl md:text-2xl my-3 text-center">Search the city name to get weather update on your dashboard</h2>
          <input
            onChange={handleChange}
            className="w-[70%] border-[2px] border-white rounded-[60px] py-2 mx-auto"
            placeholder="Search the city"
          />
          {error && (
            <div className="text-red-500 mt-4 text-center">{error}</div> // Show error message if there's an error
          )}

          {weather.length === 0 && !error && (
            <div className="text-white text-center mt-4">Loading weather data...</div>
          )}

          {weather.map((e, index) => (
            <div key={index}>
              <div className="flex justify-between mb-5 mt-10 border-top border-white">
                <h2 className="text-xl sm:text-2xl text-white font-bold">{`City : ${e.city}`}</h2>
                <button
                  onClick={() => handleDelete(e.city)}
                  className="bg-white text-[#00FFFF] px-3 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>

              <div className="flex justify-center xl:justify-between align-center gap-5 flex-wrap">
                {e.daily.slice(0, 3).map((e, index) => (
                  <div
                    key={index}
                    className="detail-container flex flex-col gap-5 text-white text-sm sm:text-xl font-medium mt-5 text-center border-white border-[2px] rounded-xl p-3"
                  >
                    <h4>{`Day : ${index + 1}`}</h4>
                    <div className="flex gap-5 align-center justify-center">
                      <h4>{e.condition.description}</h4>
                      <img
                        src={e.condition.icon_url}
                        alt="icon"
                        className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] pt-[2px]"
                      />
                    </div>

                    <h4>{`Temperature of the day : ${e.temperature.day}`}</h4>
                    <h4>{`Minimum temperature : ${e.temperature.minimum}`}</h4>
                    <h4>{`Maximum temperature : ${e.temperature.maximum}`}</h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeatherDashboard;
