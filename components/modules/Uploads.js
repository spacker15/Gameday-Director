
export default function Uploads({setState,state}){

function handle(e){

const file=e.target.files[0]

const reader=new FileReader()

reader.onload=function(evt){

const text=evt.target.result
const rows=text.split("\n")

const teams={}

rows.forEach(r=>{
const [team,player]=r.split(",")
if(!teams[team])teams[team]=[]
teams[team].push(player)
})

setState({...state,teams})
}

reader.readAsText(file)

}

return(
<div>

<h3>Upload Rosters (CSV team,player)</h3>

<input type="file" onChange={handle}/>

</div>
)
}
