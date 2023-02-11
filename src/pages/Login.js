import React, { useContext, useState } from "react";
import "../css/Login.css";
import "../App.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {dispatch} = useContext(AuthContext)
  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({type:"LOGIN", payload:user})
        localStorage.setItem("admin",user.email)
        navigate("/dashboard")
      })
      .catch((error) => {
        setError(true);
      });
  };
  return (
    <div className="login-container">
      <div className="login-body">
        <form onSubmit={handleLogin}>
          <h4>SIGN IN</h4>
          <input
            type="email"
            className="form-control login-input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control login-input"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="button login-button">
            Login
          </button>
          {error && <span className="login-error">Wrong Credentials</span>}
        </form>
      </div>
    </div>
  );
};

export default Login;
