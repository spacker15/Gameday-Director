
export default function WeatherPanel({weather}){

return(
<div className="panel">

<h3>Weather Command</h3>

<div>Temp: {weather.temp}°F</div>
<div>Conditions: {weather.conditions}</div>
<div>Wind: {weather.wind}</div>

</div>
)
}
