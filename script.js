"use strict";

// DOM Elements

const weatherDiv = document.querySelector(".weather");

const descLabel = document.querySelector(".desc");

const [
  cityLabel,
  timeLabel,
  tempLabel,
  humidityLabel,
  windLabel,
] = document.querySelectorAll("span");

const icon = document.querySelector(".icon");

const units = document.querySelectorAll("sup");

const errorLabel = document.querySelector(".error__label");

// Classes

class App {
  #apiKey = "59328a6ad74fe296d4aa2360b4141241";
  weather;

  async fetchData(cityName) {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${
          this.#apiKey
        }`
      );

      return response;
    } catch (err) {
      dom.renderError(err);
    }
  }

  async displayData(e) {
    e.preventDefault();

    try {
      weatherDiv.classList.add("hidden");

      const city = dom.getInput() || "London";

      const res = await app.fetchData(city);

      const data = await res.json();

      if (!res.ok) throw new Error(`No results found`);

      this.weather = {
        city: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        country: data.sys.country,
        description: data.weather[0].main,
        icon: data.weather[0].icon,
      };

      dom.renderData(this.weather);

      if (dom.getInput()) e.target.reset();
    } catch (err) {
      dom.renderError(err);
    }
  }

  convertTemp(temp, newUnit) {
    if (newUnit === "F") return (temp * (9 / 5) + 32).toFixed(2);

    return temp;
  }
}

class DOM {
  constructor() {
    window.addEventListener("load", app.displayData.bind(app));

    document
      .querySelector(".input")
      .addEventListener("submit", app.displayData.bind(app));

    units.forEach((unit) => unit.addEventListener("click", this.switchUnit));
  }

  getInput() {
    return document.querySelector("#city").value;
  }

  renderData(data) {
    const date = new Date();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const time = `${hours}:${minutes} - ${timezone}`;

    cityLabel.textContent = `${data.city}, ${data.country || "Earth"}`;
    timeLabel.textContent = time;
    tempLabel.textContent = data.temp;
    humidityLabel.textContent = data.humidity;
    windLabel.textContent = data.wind;
    descLabel.textContent = data.description;
    icon.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data.icon}@2x.png)`;

    weatherDiv.classList.remove("hidden");

    this.setBackgroundColor(data.temp);

    this.renderError("");
  }

  renderError(err) {
    errorLabel.textContent = err;
  }

  switchUnit() {
    units.forEach((unit) => unit.classList.remove("active"));

    this.classList.add("active");

    const newUnit = this.id;

    const currentTemp = app.weather.temp;

    const newTemp = app.convertTemp(currentTemp, newUnit);

    document.querySelector(".temp__label").textContent = newTemp;
  }

  setBackgroundColor(temp) {
    document.body.className = "";
    switch (true) {
      case temp >= 40:
        document.body.classList.add("veryHot");
        break;
      case temp >= 30:
        document.body.classList.add("hot");
        break;
      case temp >= 20:
        document.body.classList.add("warm");
        break;
      case temp >= 10:
        document.body.classList.add("cool");
        break;
      case temp >= 0:
        document.body.classList.add("cold");
        break;
      case temp < 0:
        document.body.classList.add("freezing");
        break;
    }
  }
}

const app = new App();
const dom = new DOM();
