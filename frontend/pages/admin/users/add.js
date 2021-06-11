import { useState } from "react";
import Head from "next/head";
import Header from "@components/Header";
import SweetAlert from "react-bootstrap-sweetalert";

export default function add() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });

  const addUser = async (e) => {
    let status;
    e.preventDefault();
    console.log(username, email);
    await fetch(`http://localhost:3000/users`, {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        role,
      }),
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        if (status === 200) {
          setSuccess({
            state: true,
            message: `Article with id ${data.id} has been created`,
          });
        } else {
          setError({ state: true, message: data.error });
        }
      });
  };

  const reset = () => {
    if (success.state) {
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("guest");
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
  };
  return (
    <div>
      <Head>
        <title>Add a user</title>
      </Head>
      <Header />
      <div className="container">
        <header className="mb-4">
          <h1 className="fw-bolder mb-1">Add a user</h1>
        </header>
        <section className="mt-3 mb-5">
          <form>
            <div className="form-group">
              Username
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group mt-4">
              Email
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-4">
              Password
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group my-4">
              Role
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="author">Author</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" onClick={addUser}>
              Add
            </button>
          </form>
        </section>
      </div>
      {success.state && (
        <SweetAlert success title="Success!" onConfirm={reset}>
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
