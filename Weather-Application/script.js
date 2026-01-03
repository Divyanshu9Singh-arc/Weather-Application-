const apiKey = "c6882d58e35a5ab8636ac91da829b9d6";

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

function getWeather(lat = null, lon = null) {
    let url;
    const city = document.getElementById("cityInput").value;
    const country = document.getElementById("countrySelect").value;

    if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
        if (!city) return alert("Enter city name");
        const location = country ? `${city},${country}` : city;
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            applyTheme(data.weather[0].main);
            displayWeather(data);
            getForecast(data.coord.lat, data.coord.lon);
        });
}

function applyTheme(condition) {
    document.body.className = "";
    if (condition.includes("Clear")) document.body.classList.add("sunny");
    else if (condition.includes("Rain")) document.body.classList.add("rainy");
    else if (condition.includes("Cloud")) document.body.classList.add("cloudy");
    else if (condition.includes("Snow")) document.body.classList.add("snowy");
}

function getAnimatedIcon(condition) {
    if (condition.includes("Clear")) return "https://assets10.lottiefiles.com/packages/lf20_jmBauI.json";
    if (condition.includes("Rain")) return "https://assets4.lottiefiles.com/packages/lf20_rpC1Rd.json";
    if (condition.includes("Cloud")) return "https://assets7.lottiefiles.com/packages/lf20_mznpzppq.json";
    if (condition.includes("Snow")) return "https://assets3.lottiefiles.com/packages/lf20_H7zG4z.json";
    return "https://assets10.lottiefiles.com/packages/lf20_jmBauI.json";
}

function displayWeather(data) {
    const icon = getAnimatedIcon(data.weather[0].main);
    document.getElementById("weatherResult").innerHTML = `
        <lottie-player src="${icon}" background="transparent" speed="1"
        style="width:140px;height:140px;" loop autoplay></lottie-player>
        <h5>${data.name}, ${data.sys.country}</h5>
        <div class="temp">${Math.round(data.main.temp)}°C</div>
        <p class="text-capitalize">${data.weather[0].description}</p>
        <p>💧 ${data.main.humidity}% | 💨 ${data.wind.speed} m/s</p>
    `;
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            // Hourly
            let hourly = `<h6 class="mt-3">Hourly Forecast</h6><div class="hourly-container">`;
            for (let i = 0; i < 8; i++) {
                const h = data.list[i];
                const time = new Date(h.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                hourly += `
                    <div class="hour-card">
                        <p>${time}</p>
                        <p>${Math.round(h.main.temp)}°C</p>
                    </div>`;
            }
            hourly += `</div>`;
            document.getElementById("hourlyForecast").innerHTML = hourly;

            // 5 Day
            let daily = `<h6 class="mt-3">5-Day Forecast</h6><div class="forecast">`;
            for (let i = 0; i < data.list.length; i += 8) {
                const d = data.list[i];
                const day = new Date(d.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
                daily += `<div><p>${day}</p><p>${Math.round(d.main.temp)}°C</p></div>`;
            }
            daily += `</div>`;
            document.getElementById("forecastResult").innerHTML = daily;
        });
}

function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(pos => {
        getWeather(pos.coords.latitude, pos.coords.longitude);
    });
}
