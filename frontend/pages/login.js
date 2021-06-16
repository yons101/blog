import { useEffect, useState } from "react";
import Head from "next/head";

import SweetAlert from "react-bootstrap-sweetalert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });
  useEffect(async () => {
    let token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/users/check-auth`, {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = "/";
      }
    });
  });
  const login = async (e) => {
    let status;
    e.preventDefault();
    await fetch(`http://localhost:3000/users/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (status === 200) {
          localStorage.setItem("token", data.accessToken);
          setSuccess({
            state: true,
            message: `Success`,
          });
          setTimeout(() => {
            window.location.href = `/`;
          }, 2000);
        } else {
          setError({ state: true, message: data.error });
        }
      });
  };
  const reset = () => {
    if (success.state) {
      setUsername("");
      setPassword("");
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
  };
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>

      <div className="container d-flex justify-content-center ">
        <form className="w-75 mt-10" onSubmit={login}>
          <h1 className="text-center">Sign in</h1>
          <label htmlFor="inputUsername">Username/Email</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="inputUsername"
            className="my-3 form-control"
            placeholder="Username/Email"
            required
            autoFocus
          />
          <label htmlFor="inputPassword">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="inputPassword"
            className="my-3 form-control"
            placeholder="Password"
            required
          />
          <div className="text-center d-flex justify-content-around align-items-center">
            <button className="btn btn-lg btn-primary" type="submit">
              Sign in
            </button>
            <a href="/signup">Create account</a>
          </div>
        </form>
      </div>
      {success.state && (
        <SweetAlert success title="Success!" onConfirm={reset} timeout={2000}>
          {success.message}
        </SweetAlert>
      )}
      {error.state && (
        <SweetAlert error title="Error!" onConfirm={reset}>
          {error.message}
        </SweetAlert>
      )}
    </div>
  );
}
