import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@components/Header";
import SweetAlert from "react-bootstrap-sweetalert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });
  const signup = async (e) => {
    let status;
    e.preventDefault();
    await fetch(`http://localhost:3000/users/signup`, {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        role: "guest",
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
        <title>Sign Up</title>
      </Head>
      <Header />
      <div className="container d-flex justify-content-center ">
        <form className="w-75 mt-10" onSubmit={signup}>
          <h1 className="text-center">Sign Up</h1>
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
          <label htmlFor="inputEmail">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="inputEmail"
            className="my-3 form-control"
            placeholder="Email"
            required
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
              Sign up
            </button>
            <a href="/login">Login</a>
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
