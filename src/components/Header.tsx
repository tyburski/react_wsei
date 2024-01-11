import React, { useState } from "react";
import "./style.css";

interface HeaderProps {
  onViewChange: (
    mode: "photos" | "albums" | "posts" | "users" | "settings"
  ) => void;
}

const Header: React.FC<HeaderProps> = ({ onViewChange }) => {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = () => {
    if (localStorage.getItem("userId")) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  React.useEffect(() => {
    handleChange();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?email=${email}`
      );
      const users = await response.json();

      if (users.length > 0) {
        alert("Zalogowano pomyślnie!");
        localStorage.setItem("userId", users[0].id);
        localStorage.setItem("userEmail", users[0].email);
        window.location.reload();
        handleChange();
      } else {
        alert("Użytkownik nie istnieje. Spróbuj ponownie.");
      }
    } catch {
      alert("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
    }
  };

  const handleLogout = async () => {
    localStorage.clear();
    window.location.reload();
    handleChange();
  };

  return (
    <div className="header">
      <button onClick={() => onViewChange("posts")}>POSTY</button>
      <button onClick={() => onViewChange("albums")}>ALBUMY</button>
      <button onClick={() => onViewChange("photos")}>ZDJĘCIA</button>
      <button onClick={() => onViewChange("users")}>UŻYTKOWNICY</button>
      <p></p>
      {show ? (
        <p className="username">{localStorage.getItem("userEmail")}</p>
      ) : (
        <p></p>
      )}
      {show ? (
        <button onClick={() => onViewChange("settings")}>USTAWIENIA</button>
      ) : (
        <input
          id="username"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      {show ? (
        <button onClick={handleLogout}>WYLOGUJ</button>
      ) : (
        <button className="loginButton" onClick={handleLogin}>
          ZALOGUJ
        </button>
      )}
    </div>
  );
};

export default Header;
