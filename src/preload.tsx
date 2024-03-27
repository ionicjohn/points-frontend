import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

const LoadingBar: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [hasGenerationStarted, setGenerationStarted] = useState<boolean>(false);
  const [hasClickedButton, setButtonClicked] = useState<boolean>(false);
  const [hasApiLoaded, setApiLoaded] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {
    const meow = () =>
      (async () => {
        const response = await api.getGenerateStatus();
        setApiLoaded(true);
        if (response.data.already_generated) {
          navigate("/app");
          return;
        }

        if (response.data.not_running) {
          setGenerationStarted(false);
          return;
        }

        setGenerationStarted(true);
        setTime(response.data.elapsed ?? 0);
      })();
    const interval = setInterval(meow, 5000);
    meow();

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  async function startGeneration() {
    setButtonClicked(true);
    await api.populateFileTree();
    window.location.reload();
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {hasApiLoaded &&
          (hasGenerationStarted ? (
            <div style={{ marginTop: "16px" }}>
              <h2>Drzewo plikow sie wlasnie generuje...</h2>
              <p>Od: {time} sekund</p>
            </div>
          ) : (
            <div style={{ marginTop: "16px" }}>
              <h2>Drzewo plikow jeszcze nie zostalo wygenerowane...</h2>
              <button disabled={hasClickedButton} onClick={() => startGeneration()}>
                Kliknij tutaj, aby rozpocząć generowanie drzewa plików
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LoadingBar;
