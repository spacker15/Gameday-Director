
export default function Tabs({ active, setActive, tabs }){
  return (
    <nav className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`tab ${active===tab.key ? "active" : ""}`}
          onClick={() => setActive(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
