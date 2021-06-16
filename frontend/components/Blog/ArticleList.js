import ArticleCard from "@components/Blog/ArticleCard";

const ArticleList = ({ articles }) => {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 ">
      {articles.map((article) => {
        return (
          <ArticleCard
            key={article.id}
            title={article.title}
            image={article.image}
            url={article.id}
          />
        );
      })}
    </div>
  );
};

export default ArticleList;
