export function weatherScript() {
    
    let submitButton = document.getElementById("buttonForEntry");

    var cityEntry = '';
    var locationCall = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var apiKey = '';
    
    var weatherCall = 'http://api.weatherapi.com/v1/current.json?key=*placeapikeyhere*=';
    
    
    enterEvent();
    submitButton.onclick = function() {
       
        cityEntry = document.getElementById("cityEntry").value;
    
        if (cityEntry === '') {
            window.confirm('please enter a city');
        }
    
        else {
            
            displayWeather();
        }
    }
    
    
    
    function displayWeather() {
    
        let cityArray = cityEntry.split(',');
    
        var cityString = cityArray[0].replace(",", " " );       // if the city is two words split and add an escaped space
    
        if (cityString.includes(" ")) {
            var cityTemp = cityString.split(" ")
            let cityString = cityTemp[0] + '%20' + cityTemp[1];
            cityString.trim();
        }
    
        let stateString = cityArray[1].trim();
    
        let fullAPICall = locationCall + '%20' + cityString + '%20' + stateString + '&20' + '&key=' + apiKey;
        console.log(fullAPICall);
    
        console.log(cityString);
        console.log(stateString);
    
        fetch(fullAPICall)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } 
            else { 
                window.confirm('Location Not Found, please enter a new location.')
                throw new Error('API request failed');
            }
        })
        .then(data => {
            let lat = data["results"]["0"]["geometry"]["location"]["lat"];
            let lng = data["results"]["0"]["geometry"]["location"]["lng"];
            console.log(lat);
            console.log(lng);
    
        let fullWeatherCall = weatherCall + lat + ',' + lng + "&aqi=no";
    
        fetch(fullWeatherCall)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } 
            else {
                window.confirm("Weather fetch failed, Please Try Again.")
                throw new Error('API request failed');
            }
        })
      .then(data => {       // this gets the required info from the weather api call
        console.log(data)
    
        let cloudCover = data["current"]["cloud"];
        let temp_F = data["current"]["temp_f"];
        let wind_mph = data["current"]["wind_mph"];
        let wind_dir = data["current"]["wind_dir"];
        let precip_in = data["current"]["precip_in"];
        let humidity = data["current"]["humidity"];
        let feelslike_f = data["current"]["feelslike_f"];
        let icon = data["current"]["condition"]["icon"];
    
        console.log("The temperature in " + cityString + "is " + temp_F + ".");     // prints sample to console
    
        if (cityString.includes("%20")) {
            cityString.replaceAll("[^a-zA-Z]", " ");
        };
    
        document.getElementById('temp').innerHTML = "The temperature in " + cityString.replace("%20", " ") + " is " + temp_F + "&deg." ;
        document.getElementById('humidity').innerHTML = "Humidity is at " + humidity + "&#37." ;
        document.getElementById('cloud').innerHTML = "Cloud coverage is " + cloudCover + "&#37." ; 
        document.getElementById('wind').innerHTML = "The wind is blowing " + wind_dir + " at a speed of " + wind_mph + " mph."
    
        const  weatherIcon = document.getElementById('weatherIcon');
        weatherIcon.src = icon;
    
      })
      .catch(error => {
        // Handle any errors here
        console.error(error); // Example: Logging the error to the console
            });
        });
    }
    
    
    function enterEvent() {
        document.getElementById("cityEntry").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                document.getElementById("buttonForEntry").click();
            }
        });
    }
}

