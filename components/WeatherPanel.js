
export default function WeatherPanel({weather}){

return(
<div className="panel">

<h3>Weather Command</h3>

<div>Temp: {weather.temp}</div>
<div>Humidity: {weather.humidity}</div>
<div>Lightning: {weather.lightning?"DETECTED":"Clear"}</div>

</div>
)
}
