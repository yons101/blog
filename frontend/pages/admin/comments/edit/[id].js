import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@components/Header";
import SweetAlert from "react-bootstrap-sweetalert";
import { checkAuth } from "@utils/auth";

export default function edit({ comment }) {
  const [authorized, setAuthorized] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });
  useEffect(() => {
    checkAuth(setAuthorized);
  }, []);
  const updateComment = async (e) => {
    let token = localStorage.getItem("token");
    let status;
    e.preventDefault();
    await fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: "PUT",
      body: JSON.stringify({
        content,
        ArticleId: comment.ArticleId,
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
            message: `Comment with id ${data[0].id} has been updated`,
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
      window.location.href = `/admin/comments/`;
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
  };
  return (
    <div>
      <Head>
        <title>Update comment</title>
      </Head>
      <Header />
      {authorized && (
        <div className="container">
          <header className="mb-4">
            <h1 className="fw-bolder mb-1">Update comment</h1>
          </header>
          <section className="mt-3 mb-5">
            <form>
              <div className="form-group mb-4">
                Content
                <input
                  type="text"
                  className="form-control"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={updateComment}
              >
                Update
              </button>
            </form>
          </section>
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
  const res = await fetch(`http://localhost:3000/comments/${id}`);
  const comment = await res.json();
  return { props: { comment } };
}
