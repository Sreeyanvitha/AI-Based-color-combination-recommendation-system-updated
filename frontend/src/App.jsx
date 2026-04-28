import { useState } from "react";

function App() {
  const [result, setResult] = useState("");
  const [file, setFile] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function checkOutfit() {
    const formData = new FormData();

    formData.append("outfit", file);
    formData.append("skin_image", file); // using same image
    formData.append("skin_tone", "Medium");
    formData.append("occasion", "Casual");

    fetch("https://ai-based-color-combination-t838.onrender.com/api/analyze", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setResult(JSON.stringify(data, null, 2));
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h1>Outfit Checker 🎨</h1>

      <input type="file" onChange={handleFileChange} />

      <button onClick={checkOutfit}>
        Check Outfit
      </button>

      <pre>{result}</pre>
    </div>
  );
}

export default App;
