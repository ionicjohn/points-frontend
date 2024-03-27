import "./css/App.css";
import TreeView from "./mainForm.jsx";
import api from "./api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [currentCompany, setCurrentCompany] = useState({});
  const [outputValue, setOutputValue] = useState([]);
  const [timeValue, setTimeValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { output, time } = (await api.getCached()).data;
      if ((output ?? []).length == 0) {
        navigate("/");
        return;
      }

      setTimeValue(time);
      setOutputValue(output);
      setCurrentCompany({
        data: output["E0401"],
        company: "E0401"
      });
    })();
  }, [navigate]);

  return (
    timeValue && (
      <>
        <h1>Struktura drzewkowa</h1>
        <p>Ostatnio indeksowano: {timeValue} </p>
        <select
          onChange={(e) => {
            console.log(e.target.value)
            setCurrentCompany({
              data: outputValue[e.target.value],
              company: e.target.value
            })
          }}
        >
          {Object.getOwnPropertyNames(outputValue).map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <TreeView {...currentCompany} />
      </>
    )
  );
}

export default App;
