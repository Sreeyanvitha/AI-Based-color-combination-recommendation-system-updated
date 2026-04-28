import { useState } from "react";

function App() {
  const [result, setResult] = useState("");

  function checkOutfit() {
    fetch("https://your-api.onrender.com/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        top: "red",
        bottom: "blue"
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setResult(JSON.stringify(data));
    })
    .catch(err => console.error(err));
  }

  return (
    <div>
      <h1>Outfit Checker 🎨</h1>

      <button onClick={checkOutfit}>
        Check Outfit
      </button>

      <h3>{result}</h3>
    </div>
  );
}

export default App;
