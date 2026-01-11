export default function Tabs({ active, onChange }) {
  return (
    <div className="tabs">
      <button onClick={() => onChange("SINGLE")}
        className={active === "SINGLE" ? "active" : ""}>
        Singles
      </button>

      <button onClick={() => onChange("COMBO")}
        className={active === "COMBO" ? "active" : ""}>
        Combos
      </button>
    </div>
  );
}
