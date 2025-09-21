import React from "react";
import api from "../../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CustomerLogin() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { emailOrMobile, password });
      // console.log(res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/")
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Customer Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          placeholder="mobile number or email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading...</p>}
        <button type="submit">Login</button>
      </form>

      <Link to="/register">Don't have an account? Register</Link>
    </div>
  );
}

export default CustomerLogin;
