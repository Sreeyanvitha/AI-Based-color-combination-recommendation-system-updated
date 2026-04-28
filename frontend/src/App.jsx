import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("https://your-api.onrender.com/")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Frontend Connected</h1>
    </div>
  );
}

export default App;
