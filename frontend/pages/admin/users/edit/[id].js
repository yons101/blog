import { useState } from "react";
import Head from "next/head";
import Header from "@components/Header";
import SweetAlert from "react-bootstrap-sweetalert";

export default function edit({ user }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [role, setRole] = useState(user.role);
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });

  const updateUser = async (e) => {
    let status;
    e.preventDefault();
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PUT",
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
            message: `User with id ${data[0].id} has been updated`,
          });
          // setTimeout(() => {
          // },);
        } else {
          setError({ state: true, message: data.error });
        }
      });
  };

  const reset = () => {
    if (success.state) {
      window.location.href = `/admin/users/`;
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
  };
  return (
    <div>
      <Head>
        <title>Update user</title>
      </Head>
      <Header />
      <div className="container">
        <header className="mb-4">
          <h1 className="fw-bolder mb-1">Update user</h1>
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
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updateUser}
            >
              Update
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

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`http://localhost:3000/users/${id}`);
  const user = await res.json();
  return { props: { user } };
}
