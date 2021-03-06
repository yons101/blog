import { useState, useEffect } from "react";
import Head from "next/head";
import SweetAlert from "react-bootstrap-sweetalert";
import { checkAuth } from "@utils/auth";

export default function edit({ article }) {
  const [authorized, setAuthorized] = useState(0);
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });

  useEffect(() => {
    checkAuth(setAuthorized);
  }, []);

  const updateArticle = async (e) => {
    let token = localStorage.getItem("token");
    let status;
    e.preventDefault();
    await fetch(`http://localhost:3000/articles/${article.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content,
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
            message: `Article with id ${data[0].id} has been updated`,
          });
        } else {
          setError({ state: true, message: data.error });
        }
      });
  };

  const reset = () => {
    if (success.state) {
      window.location.href = `/admin/articles/`;
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
  };
  return (
    <div>
      <Head>
        <title>Update article</title>
      </Head>

      {authorized === 2 ? (
        <div className="container">
          <header className="mb-4">
            <h1 className="fw-bolder mb-1">Update article</h1>
          </header>
          <section className="mt-3 mb-5">
            <form>
              <div className="form-group">
                Title
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group my-4">
                Content
                <textarea
                  className="form-control"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={updateArticle}
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
  const res = await fetch(`http://localhost:3000/articles/${id}`);
  const article = await res.json();
  return { props: { article } };
}
