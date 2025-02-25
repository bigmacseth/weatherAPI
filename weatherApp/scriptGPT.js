import React, { useState } from 'react';

function WeatherApp() {
    const [cityEntry, setCityEntry] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');

    const apiKey = '';
    const weatherApiKey = '';

    const handleInputChange = (event) => {
        setCityEntry(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleFetchWeather();
        }
    };

    const handleFetchWeather = async () => {
        if (!cityEntry) {
            alert('Please enter a city.');
            return;
        }

        try {
            // Process city input
            const cityArray = cityEntry.split(',');
            const cityString = cityArray[0]?.trim().replace(/\s+/g, '%20');
            const stateString = cityArray[1]?.trim();
            const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cityString}%20${stateString}&key=${apiKey}`;
            
            const locationResponse = await fetch(locationUrl);
            if (!locationResponse.ok) throw new Error('Location API request failed');
            const locationData = await locationResponse.json();

            const lat = locationData.results[0]?.geometry?.location?.lat;
            const lng = locationData.results[0]?.geometry?.location?.lng;

            if (!lat || !lng) throw new Error('Location not found');

            // Fetch weather data
            const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${lat},${lng}&aqi=no`;
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) throw new Error('Weather API request failed');
            const weatherData = await weatherResponse.json();

            setWeatherData(weatherData);
            setError('');
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred');
            setWeatherData(null);
        }
    };

    return (
        <div className=' px-6 w-full h-fit text-2xl'>
            <input
                className='px-2'
                type="text"
                id="cityEntry"
                placeholder="Enter city, state"
                value={cityEntry}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button 
                id="buttonForEntry" 
                onClick={handleFetchWeather}
                className='bg-purple-500 hover:bg-purple-700 active:bg-purple-950 mx-2 px-2'
            >
                Get Weather
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weatherData && (
                <div className='text-orange-400 text-2xl'>
                    <h2 className='py-2'>Weather in {weatherData.location.name}</h2>
                    <p className='py-2'>Temperature: {weatherData.current.temp_f}°F</p>
                    <p className='py-2'>Humidity: {weatherData.current.humidity}%</p>
                    <p className='py-2'>Cloud Coverage: {weatherData.current.cloud}%</p>
                    <p className='py-2'>Wind: {weatherData.current.wind_mph} mph {weatherData.current.wind_dir}</p>
                    <img className='py-2'
                        src={weatherData.current.condition.icon}
                        alt={weatherData.current.condition.text}
                    />
                </div>
            )}
        </div>
    );
}

export default WeatherApp;
