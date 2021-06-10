const ArticleCard = ({ title, image, url }) => {
  return (
    <a className="col mt-5" href={url} target="_blank">
      <div className="card">
        <img src={image} className="card-img-top" alt="..." />
        <div className="card-body" style={{ height: "7rem" }}>
          <h5 className="card-title text-center">{title}</h5>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;
