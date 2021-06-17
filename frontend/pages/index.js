import Head from "next/head";
import ArticleList from "@components/Blog/ArticleList";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Blog</title>
      </Head>

      <div className="container">
        <ArticleList />
      </div>
    </div>
  );
}
