import { useEffect } from "react";
import Head from "next/head";

import ArticleList from "@components/Blog/ArticleList";

export default function Home({ articles }) {
  useEffect(() => {
    console.log(articles);
  }, []);
  return (
    <div>
      <Head>
        <title>Blog</title>
      </Head>

      <div className="container">
        <ArticleList articles={articles} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3000/articles/1/20`);
  const articles = await res.json();

  return { props: { articles } };
}
