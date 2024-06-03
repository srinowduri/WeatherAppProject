async function fetchWeather() {
  const city = document.querySelector(".search-bar").value;
  document.querySelector(".refresh-btn").addEventListener("click", () => {
    window.location.reload(true);
  });
  const apiKey = "4fc13d57db26fb1ec2c5768760038f6c";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  const uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat={lat}&lon={lon}`;
  const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=${apiKey}`;

  document.getElementById("loading").style.display = "block";
  document.getElementById("error-message").style.display = "none";

  try {
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod === 200) {
      document.getElementById(
        "temperature"
      ).textContent = `${weatherData.main.temp}°F`;
      document.getElementById("weather").textContent =
        weatherData.weather[0].description;
      document.getElementById(
        "weather-icon"
      ).src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
      document.getElementById(
        "wind"
      ).textContent = `${weatherData.wind.speed} mph`;
      document.getElementById(
        "humidity"
      ).textContent = `${weatherData.main.humidity}%`;
      document.getElementById("visibility").textContent = `${
        weatherData.visibility / 1000
      } m`;
      document.getElementById("sunrise").textContent = new Date(
        weatherData.sys.sunrise * 1000
      ).toLocaleTimeString();
      document.getElementById("sunset").textContent = new Date(
        weatherData.sys.sunset * 1000
      ).toLocaleTimeString();

      const { lat, lon } = weatherData.coord;

      // Fetch UV Index
      const uvResponse = await fetch(
        uvIndexUrl.replace("{lat}", lat).replace("{lon}", lon)
      );
      const uvData = await uvResponse.json();
      const uvIndex = document.getElementById("uv-index");
      uvIndex.textContent = uvData.value;
      uvIndex.className = "uv-index";
      if (uvData.value <= 2) uvIndex.classList.add("low");
      else if (uvData.value <= 5) uvIndex.classList.add("moderate");
      else if (uvData.value <= 7) uvIndex.classList.add("high");
      else if (uvData.value <= 10) uvIndex.classList.add("very-high");
      else uvIndex.classList.add("extreme");

      // Fetch Air Quality Index
      const aqiResponse = await fetch(
        aqiUrl.replace("{lat}", lat).replace("{lon}", lon)
      );
      const aqiData = await aqiResponse.json();
      const aqiValue = aqiData.list[0].main.aqi;
      const aqi = document.getElementById("aqi");
      aqi.textContent = aqiValue;
      aqi.className = "aqi";
      if (aqiValue === 1) aqi.classList.add("good");
      else if (aqiValue === 2) aqi.classList.add("moderate");
      else if (aqiValue === 3)
        aqi.classList.add("unhealthy-for-sensitive-groups");
      else if (aqiValue === 4) aqi.classList.add("unhealthy");
      else if (aqiValue === 5) aqi.classList.add("very-unhealthy");
      else aqi.classList.add("hazardous");
    } else {
      throw new Error(weatherData.message);
    }

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (forecastData.cod === "200") {
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "<h2>5-Day Forecast</h2>";
      forecastData.list.forEach((item) => {
        if (item.dt_txt.includes("12:00:00")) {
          const forecastDay = document.createElement("div");
          forecastDay.className = "forecast-day";
          forecastDay.innerHTML = `
                          <p><strong>${new Date(
                            item.dt_txt
                          ).toLocaleDateString()}</strong></p>
                          <p><strong>Temp:</strong> ${item.main.temp}°F</p>
                          <p><strong>Weather:</strong> ${
                            item.weather[0].description
                          }</p>
                          <img src="https://openweathermap.org/img/wn/${
                            item.weather[0].icon
                          }@2x.png" class="weather-icon" alt="Weather icon">
                      `;
          forecastContainer.appendChild(forecastDay);
        }
      });
    } else {
      throw new Error(forecastData.message);
    }
  } catch (error) {
    document.getElementById(
      "error-message"
    ).textContent = `Error: ${error.message}`;
    document.getElementById("error-message").style.display = "block";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

async function refreshWeather() {
  const city = document.querySelector(".search-bar").value;
  if (city) {
    fetchWeather();
  } else {
    alert("Please enter a city name to refresh the weather information.");
  }
}
