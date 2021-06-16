import { useState, useEffect } from "react";
import Head from "next/head";

import SweetAlert from "react-bootstrap-sweetalert";
import { checkAuth } from "@utils/auth";

export default function edit({ tag }) {
  const [authorized, setAuthorized] = useState(0);
  const [name, setName] = useState(tag.name);
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });
  useEffect(() => {
    checkAuth(setAuthorized);
  }, []);
  const updateTag = async (e) => {
    let token = localStorage.getItem("token");
    let status;
    e.preventDefault();
    await fetch(`http://localhost:3000/tags/${tag.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
            message: `Tag with id ${data[0].id} has been updated`,
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
      window.location.href = `/admin/tags/`;
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
  };
  return (
    <div>
      <Head>
        <title>Update tag</title>
      </Head>

      {authorized === 2 ? (
        <div className="container">
          <header className="mb-4">
            <h1 className="fw-bolder mb-1">Update tag</h1>
          </header>
          <section className="mt-3 mb-5">
            <form>
              <div className="form-group mb-4">
                Name
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                onClick={updateTag}
              >
                Update
              </button>
            </form>
          </section>
        </div>
      ) : (
        <div
          class="authorization-alert container d-flex justify-content-center alert alert-danger"
          role="alert"
        >
          You are not authorized
        </div>
      )}
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
  const res = await fetch(`http://localhost:3000/tags/${id}`);
  const tag = await res.json();
  return { props: { tag } };
}
