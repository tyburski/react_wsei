import React, { useEffect, useState } from "react";
import "./style.css";

const Settings: React.FC = () => {
  const [email, setEmail] = useState("");
  const [repeat, setRepeat] = useState("");
  const [currentEmail, setCurrentEmail] = useState(
    localStorage.getItem("userEmail")
  );

  const changeEmail = async () => {
    try {
      console.log(localStorage.getItem("userId"));
      fetch("https://jsonplaceholder.typicode.com/users/1", {
        method: "PUT",
        body: JSON.stringify({
          email: email,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));

      if (email === repeat) {
        alert("Email zmieniony pomyślnie!");
        localStorage.setItem("userEmail", email);
        setCurrentEmail(localStorage.getItem("userEmail"));
        window.location.reload();
      } else {
        alert("Podane dane są niepoprawne. Spróbuj ponownie.");
      }
    } catch {
      alert("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <div className="settings">
      <h2>USTAWIENIA</h2>
      <div>
        <p>{currentEmail}</p>
      </div>
      <div className="settings-email">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="NOWY EMAIL"
        ></input>
        <input
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          className="repeat"
          placeholder="POWTÓRZ EMAIL"
        ></input>
      </div>
      <button onClick={changeEmail}>POTWIERDŹ</button>
    </div>
  );
};

export default Settings;
