import { useState, useEffect } from "react";
import Head from "next/head";

import dayjs from "dayjs";
import SweetAlert from "react-bootstrap-sweetalert";
import { checkAuth } from "@utils/auth";

export default function Article({ article, user, comments }) {
  const [authorized, setAuthorized] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });

  useEffect(() => {
    checkAuth(setAuthorized);
  }, []);

  const addComment = async (e) => {
    let token = localStorage.getItem("token");
    let status;
    e.preventDefault();
    await fetch(`http://localhost:3000/comments`, {
      method: "POST",
      body: JSON.stringify({
        content: commentContent,
        ArticleId: article.id,
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
        console.log(data);
        if (status === 200) {
          setSuccess({
            state: true,
            message: `Your comment has been posted!`,
          });
        } else {
          setError({ state: true, message: data.error });
        }
      });
  };

  const reset = () => {
    if (success.state) {
      setCommentContent("");
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
    location.reload();
  };

  return (
    <div>
      <Head>
        <title>{article.title}</title>
      </Head>

      <div className="container">
        <header className="mb-4">
          <h1 className="fw-bolder mb-1">{article.title}</h1>
          <div className="text-muted fst-italic mb-2">
            Posted on {dayjs(article.createdAt).toString()} by {user.username}
          </div>
          <a
            className="badge bg-secondary text-decoration-none link-light"
            href="#!"
          >
            Tag1
          </a>
          <a
            className="badge bg-secondary text-decoration-none link-light"
            href="#!"
          >
            Tag2
          </a>
        </header>
        <img className="img-fluid rounded" src={article.image} alt="..." />
        <section className="mt-3 mb-5">
          <p className="fs-5 mb-4">{article.content}</p>
        </section>
        <section className="mt-3 mb-5">
          <div className="fs-5 mb-4">
            <h3 className="mb-4">Comments:</h3>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} className="mt-2">
                  {comment.content}{" "}
                  <small>
                    <em>Posted on {dayjs(comment.createdAt).toString()}</em>
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {authorized > 0 ? (
          <section className="mt-3 mb-5">
            <div className="fs-5 mb-4">
              <h3 className="mb-4">Add a comment:</h3>
              <form>
                <div className="form-group">
                  <textarea
                    type="text"
                    className="form-control"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mt-2"
                  onClick={addComment}
                >
                  Post
                </button>
              </form>
            </div>
          </section>
        ) : (
          <h5 className="mb-4">
            <a href="/login">Login to comment</a>
          </h5>
        )}
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

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`http://localhost:3000/articles/${id}`);
  const article = await res.json();
  const res2 = await fetch(`http://localhost:3000/users/${article.UserId}`);
  const user = await res2.json();
  const res3 = await fetch(`http://localhost:3000/articles/${id}/comments`);
  const comments = await res3.json();
  return { props: { article, user, comments } };
}
