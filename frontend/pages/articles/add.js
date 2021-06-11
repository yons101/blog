import { useState } from "react";
import Head from "next/head";
import Header from "@components/Header";
import faker from "faker";

export default function add() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addArticle = async (e) => {
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
      .then((response) => response.json())
      .then((data) => console.log(data));
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
    </div>
  );
}
