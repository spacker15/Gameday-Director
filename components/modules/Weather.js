
export default function Weather({weather}){
return(
<div className="panel">
<h3>Weather / Lightning</h3>
<div>Temp: {weather.temp}</div>
<div>Humidity: {weather.humidity}</div>
<div>Lightning: {weather.lightning?"Detected":"Clear"}</div>
</div>
)
}
