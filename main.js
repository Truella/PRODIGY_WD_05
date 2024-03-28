const apiKey = "b1c9a177406d954cfff089c5706fbbbb";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
let place;
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const errorMsg = document.querySelector(".error");
const weatherContainer = document.querySelector(".weather");
const spinner = document.querySelector(".spinner");
function removeClass(element, className) {
  element.classList.remove(className);
}
function addClass(element, className) {
  element.classList.add(className);
}
const hideSpinner = ()=>{
  addClass(spinner, "hidden")
}
const showSpinner = ()=>{
  removeClass(spinner, "hidden")
}


let regexPattern = /[!@#$%^&*()_+;:'"|\\|\\?><,.1234567890]/;
let errorOccurred = false;
function checkWeather(location) {
  const url = apiUrl + location + `&appid=${apiKey}`;
  showSpinner()
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status: " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      hideSpinner()
      errorMsg.innerHTML = error;
      setTimeout(() => {
        errorMsg.style.display = "none";
        document.querySelector(".search input").value = "";
      }, 4000);
      errorMsg.style.display = "block";
      weatherContainer.classList.add("hidden");
      errorOccurred = true;
    })
    .then((data) => {
      hideSpinner()
      if (!errorOccurred) {
        weatherContainer.classList.remove("hidden");
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML =
          Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML =
          data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";
        if (data.weather[0].main == "Clouds") {
          weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Drizzle") {
          weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Clear") {
          weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
          weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Mist") {
          weatherIcon.src = "images/mist.png";
        }
      }
    });
}
searchBtn.addEventListener("click", () => {
  place = document.querySelector(".search input").value;
  let invalidInput = regexPattern.test(place);
  if (!navigator.onLine) {
    errorMsg.innerHTML =
      "Please turn on your data or connect to a wireless data connection";
    errorMsg.style.display = "block";
    setTimeout(() => {
      errorMsg.style.display = "none";
    }, 4000);
  } else {
    if (invalidInput || place.length < 1) {
      errorMsg.innerHTML = "Input a valid location";
      errorMsg.style.display = "block";
      setTimeout(() => {
        errorMsg.style.display = "none";
        document.querySelector(".search input").value = "";
      }, 4000);
    } else {
      checkWeather(place);
    }
  }
});
