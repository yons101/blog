import ArticleCard from "@components/Blog/ArticleCard";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const ArticleList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [articles, setArticles] = useState([]);

  useEffect(() => fetchArticles(), []);
  const fetchArticles = async () => {
    const res = await fetch(`http://localhost:3000/articles`);
    const articles = await res.json();
    setArticles(articles);
  };
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };
  const PER_PAGE = 6;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(articles.length / PER_PAGE);

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 ">
        {articles.slice(offset, offset + PER_PAGE).map((article) => {
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
      <div className="d-flex justify-content-center mt-5">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination "}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          activeClassName={"page-item active"}
          activeLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          disabledClassName={"page-item disabled"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
        />
      </div>
    </>
  );
};

export default ArticleList;
