
export default function Tabs({active,setActive,tabs}){
  return(
    <div className="tabs">
      {tabs.map(t=>(
        <button key={t.key} onClick={()=>setActive(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
