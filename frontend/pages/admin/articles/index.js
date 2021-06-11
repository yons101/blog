import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@components/Header";
import faker from "faker";
import SweetAlert from "react-bootstrap-sweetalert";
import dayjs from "dayjs";

export default function index() {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    const res = await fetch(`http://localhost:3000/articles/1/5`);
    const articles = await res.json();
    setArticles(articles);
  };
  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <Head>
        <title>All Articles</title>
      </Head>
      <Header />
      <article className="container">
        <header className="mb-4">
          <h1 className="fw-bolder mb-1">All Articles</h1>
        </header>
        <section className="mt-3 mb-5">
          <table class="table table-striped mt-4">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">title</th>
                <th scope="col">updatedAt</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                return (
                  <tr>
                    <th scope="row">{article.id}</th>
                    <td>{article.title}</td>
                    <td>{dayjs(article.updatedAt, "MM-DD-YYYY").toString()}</td>
                    <td class="text-right">
                      {/* <a
                        class="btn btn-primary"
                        onclick="updateArticle(event, ${article.id}, '${article.articlename}', '${article.email}')"
                      >
                        Edit
                      </a>
                      <a
                        class="btn btn-danger"
                        onclick="deleteArticle(event, ${article.id})"
                      >
                        Delete
                      </a> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </article>
    </div>
  );
}
