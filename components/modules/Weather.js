
export default function Weather({weather,setWeather}){

function triggerDelay(){

setWeather({
...weather,
lightning:true,
delayTimer:30
})

}

return(
<div className="panel">

<h3>Weather / Lightning</h3>

<div>Temp: {weather.temp}</div>
<div>Humidity: {weather.humidity}</div>
<div>Lightning: {weather.lightning?"DETECTED":"Clear"}</div>

<button onClick={triggerDelay}>Trigger Lightning Delay</button>

{weather.delayTimer && (
<div style={{marginTop:"10px"}}>
Lightning Delay Active: {weather.delayTimer} minutes
</div>
)}

</div>
)
}
