import { useState } from "react";
import Head from "next/head";
import Header from "@components/Header";
import faker from "faker";
import SweetAlert from "react-bootstrap-sweetalert";

export default function add() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });

  const addArticle = async (e) => {
    let status;
    e.preventDefault();
    console.log(title, content);
    await fetch(`http://localhost:3000/articles`, {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        image: `https://picsum.photos/500/500?random=${faker.datatype.number()}`,
        published: 0,
        UserId: 1,
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
      setTitle("");
      setContent("");
    }
    setSuccess({ state: false, message: "" });
    setError({ state: false, message: "" });
  };
  return (
    <div>
      <Head>
        <title>Add an article</title>
      </Head>
      <Header />
      <article className="container">
        <header className="mb-4">
          <h1 className="fw-bolder mb-1">Add an article</h1>
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
              onClick={addArticle}
            >
              Add
            </button>
          </form>
        </section>
      </article>
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
