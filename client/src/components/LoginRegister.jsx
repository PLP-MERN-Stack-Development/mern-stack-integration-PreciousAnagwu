import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "register" : "login";

    fetch(`${import.meta.env.VITE_API_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          setError(data.message || "Authentication failed");
        }
      })
      .catch((err) => setError("Server error"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default LoginRegister;
