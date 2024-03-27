import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

const LoadingBar: React.FC = () => {
  const [time, setTime] = useState(0);
  const [hasGenerationStarted, setGenerationStarted] = useState(false);
  const [hasClickedButton, setButtonClicked] = useState(false);
  const [hasApiLoaded, setApiLoaded] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const meow = () => (async () => {
      if (error) {
        return;
      }

      const response = await api.getGenerateStatus();
      setApiLoaded(true);

      if (response.data.already_generated) {
        navigate("/app");
        return;
      }

      if (response.data?.error) {
        setGenerationStarted(false);
        setError(response.data?.error ?? "");
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
  }, [navigate, error]);

  async function startGeneration() {
    setButtonClicked(true);
    setError("");
    await api.populateFileTree();
    window.location.reload();
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {hasApiLoaded && (
          hasGenerationStarted ? (
            <div style={{ marginTop: "16px" }}>
              <h2>Drzewo plików się właśnie generuje...</h2>
              <p>Od: {time} sekund</p>
            </div>
          ) : error ? (
            <div>
              <h2>Wystąpił błąd podczas generowania drzewa plików</h2>
              <div style={{ backgroundColor: "#A9A9A9", padding: "16px", borderRadius: "8px" }}>
                <p style={{ color: "#FF0000", fontWeight: "bold" }}>{error}</p>
                <p style={{ color: "#FFD700" }}>1. Spróbuj sprawdzić, czy dane w pliku .env są poprawne</p>
                <p style={{ color: "#FFD700" }}>2. Sprawdź, czy jesteś podłączony do VPN'a lub czy ma on aktywne połączenie</p>
                <p style={{ color: "#FFD700" }}>W przypadku dalszych problemów, skontaktuj się z Jędrzejem Natkowskim.</p>
              </div>
              <button onClick={() => startGeneration()}>Generuj ponownie</button>
            </div>
          ) : (
            <div style={{ marginTop: "16px" }}>
              <h2>Drzewo plików jeszcze nie zostało wygenerowane...</h2>
              <button disabled={hasClickedButton} onClick={() => startGeneration()}>
                Kliknij tutaj, aby rozpocząć generowanie drzewa plików
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LoadingBar;