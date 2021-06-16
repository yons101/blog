import Head from "next/head";
import Header from "@components/Header";
import dayjs from "dayjs";

export default function Article({ article, user, comments }) {
  return (
    <div>
      <Head>
        <title>{article.title}</title>
      </Head>
      <Header />
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
      </div>
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
