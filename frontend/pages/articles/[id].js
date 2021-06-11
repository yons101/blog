import Head from "next/head";
import Header from "@components/Header";
import dayjs from "dayjs";

export default function Article({ article, user }) {
  return (
    <div>
      <Head>
        <title>{article.title}</title>
      </Head>
      <Header />
      <article className="container">
        <header className="mb-4">
          <h1 className="fw-bolder mb-1">{article.title}</h1>
          <div className="text-muted fst-italic mb-2">
            Posted on {dayjs(article.createdAt, "MM-DD-YYYY").toString()} by{" "}
            {user.username}
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
      </article>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`http://localhost:3000/articles/${id}`);
  const article = await res.json();
  const res2 = await fetch(`http://localhost:3000/users/${article.UserId}`);
  const user = await res2.json();
  return { props: { article, user } };
}
