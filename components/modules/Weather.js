
export default function Weather({weather}){

return(
<div className="panel">

<h3>Weather Command</h3>

<div>Temp: {weather.temp}</div>
<div>Conditions: {weather.conditions}</div>
<div>Wind: {weather.wind}</div>

</div>
)
}
