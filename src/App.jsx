import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [weather1, setWeather1] = useState(null);
  const [weather2, setWeather2] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const baseURL = "https://weather-app-jjaf.onrender.com";

  const [selectedWeather, setSelectedWeather] = useState(null);
      
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);
  const searchCities = async (query, setterFunction) => {
    if (query.length >= 3) {
      try {
        const response = await axios.get(`${baseURL}/search/${query}`);
        setterFunction(response.data);
      } catch (error) {
        console.error("Error searching cities:", error);
      }
    } else {
      setterFunction([]);
    }
  };

  const handleCityInput = (e, setCityFunction, setSuggestionsFunction) => {
    const value = e.target.value;
    setCityFunction(value);
    searchCities(value, setSuggestionsFunction);
  };

  const selectCity = (city, setCityFunction, setSuggestionsFunction) => {
    setCityFunction(city);
    setSuggestionsFunction([]);
  };

  const fetchWeather = async () => {
    if (city1) {
      const res1 = await axios.get(`${baseURL}/weather/${city1}`);
      setWeather1(res1.data);
    }
    if (city2) {
      const res2 = await axios.get(`${baseURL}/weather/${city2}`);
      setWeather2(res2.data);
    }
  };

  const saveFavorite = (city) => {
    if (!favorites.includes(city)) {
      const updated = [...favorites, city];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };
  const showDetailedWeather = (weather) => {
    setSelectedWeather(weather);
  };

  return (
    <div className="weather-container">
      <h2 className="title">A weather app</h2>
      <div className="input-container">
        <div className="search-container">
          <input
            className="input-field"
            value={city1}
            onChange={(e) => handleCityInput(e, setCity1, setSuggestions1)}
            placeholder="Enter first city"
          />
          {suggestions1.length > 0 && (
            <div className="suggestions">
              {suggestions1.map((city, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => selectCity(city.name, setCity1, setSuggestions1)}
                >
                  {city.name}, {city.country}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search-container">
          <input
            className="input-field"
            value={city2}
            onChange={(e) => handleCityInput(e, setCity2, setSuggestions2)}
            placeholder="Enter second city"
          />
          {suggestions2.length > 0 && (
            <div className="suggestions">
              {suggestions2.map((city, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => selectCity(city.name, setCity2, setSuggestions2)}
                >
                  {city.name}, {city.country}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="compare-button" onClick={fetchWeather}>
          Compare
        </button>
      </div>

      <div className="weather-cards">
        {selectedWeather ? (
          <div className="weather-card-large">
            <h2>{selectedWeather.weather[0].name}</h2>
            <img 
              src={`https://openweathermap.org/img/wn/${selectedWeather.weather[0].icon}@4x.png`}
              alt={selectedWeather.weather[0].description}
              className="weather-icon-large"
            />
            <div className="weather-details">
              <p className="weather-info-large">{selectedWeather.weather[0].description}</p>
              <p className="weather-info-large">Temperature: {selectedWeather.main.temp}°C</p>
              <p className="weather-info-large">Humidity: {selectedWeather.main.humidity}%</p>
              <p className="weather-info-large">Wind Speed: {selectedWeather.wind.speed} m/s</p>
              <p className="weather-info-large">Pressure: {selectedWeather.main.pressure} hPa</p>
            </div>
            <div className="button-group">
              <button className="save-button" onClick={() => saveFavorite(selectedWeather.name)}>
                Save
              </button>
              <button className="back-button" onClick={() => setSelectedWeather(null)}>
                Back 
              </button>
            </div>
          </div>
        ) : (
          <>
            {weather1 && (
              <div className="weather-card" onClick={() => showDetailedWeather(weather1)}>
                <h3>{weather1.name}</h3>
            <img 
              src={`https://openweathermap.org/img/wn/${weather1.weather[0].icon}@2x.png`}
              alt={weather1.weather[0].description}
              className="weather-icon"
            />
            <p className="weather-info">{weather1.weather[0].description}</p>
            <p className="weather-info">{weather1.main.temp}°C</p>
            <p className="weather-info">Humidity: {weather1.main.humidity}%</p>
            <button className="save-button" onClick={() => saveFavorite(weather1.name)}>
              Save
            </button>
              </div>
            )}
            {weather2 && (
              <div className="weather-card" onClick={() => showDetailedWeather(weather2)}>
                <h3>{weather2.name}</h3>
              <img 
                src={`https://openweathermap.org/img/wn/${weather2.weather[0].icon}@2x.png`}
                alt={weather2.weather[0].description}
                className="weather-icon"
              />
              <p className="weather-info">{weather2.weather[0].description}</p>
              <p className="weather-info">{weather2.main.temp}°C</p>
              <p className="weather-info">Humidity: {weather2.main.humidity}%</p>
              <button className="save-button" onClick={() => saveFavorite(weather2.name)}>
                Save
              </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="favorites-section">
        <h4 className="title">Your Favorites</h4>
        {favorites.map((city, i) => (
          <button 
            key={i} 
            className="favorite-button"
            onClick={() => setCity1(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
