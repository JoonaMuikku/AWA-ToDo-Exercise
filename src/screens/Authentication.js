import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import React from "react";
import { useUser } from "../context/useUser";
import { useState } from "react";

export const AuthenticationMode = Object.freeze({
  Login: "Login",
  Register: "Register",
});

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signUp, signIn } = useUser();
  const Navigate = useNavigate();
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    if (!password || password.length < 8) {
      alert("Password must be at least 8 characters long");
      setError("Password must be at least 8 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword(user.password)) {
      return;
    }

    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp();
        Navigate("/signin");
      } else {
        await signIn();
        Navigate("/");
      }
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data.error
          : error;
      alert(message);
    }
  };

  return (
    <div className="auth-container">
      <h3>
        {authenticationMode === AuthenticationMode.Login
          ? "Sign in"
          : "Sign up"}
      </h3>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={(event) =>
              setUser({ ...user, email: event.target.value })
            }
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(event) =>
              setUser({ ...user, password: event.target.value })
            }
          />
        </div>
        <div>
          <button>
            {authenticationMode === AuthenticationMode.Login
              ? "Login"
              : "Submit"}
          </button>
        </div>
        <div>
          <Link
            to={
              authenticationMode === AuthenticationMode.Login
                ? "../signup"
                : "../signin"
            }
          >
            {authenticationMode === AuthenticationMode.Login
              ? "No account? Sign up"
              : "Already signed up? Sign in"}
          </Link>
        </div>
      </form>
    </div>
  );
}
