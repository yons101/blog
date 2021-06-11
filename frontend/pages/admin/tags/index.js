import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@components/Header";
import faker from "faker";
import SweetAlert from "react-bootstrap-sweetalert";
import dayjs from "dayjs";
import ReactPaginate from "react-paginate";

export default function index() {
  const [tags, setTagss] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState({ show: false, id: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const fetchTagss = async () => {
    const res = await fetch(`http://localhost:3000/tags`);
    const tags = await res.json();
    setTagss(tags);
  };
  useEffect(() => {
    fetchTagss();
  }, []);
  const deleteTags = async (id) => {
    await fetch(`http://localhost:3000/tags/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        fetchTagss();
        console.log(data);
      });
  };
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const PER_PAGE = 5;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(tags.length / PER_PAGE);
  return (
    <div>
      <Head>
        <title>All Tags</title>
      </Head>
      <Header />
      <div className="container">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <h1 className="fw-bolder mb-1">All Tags</h1>
          <a className="btn btn-primary" href="/admin/tags/add">
            Add a tag
          </a>
        </header>
        <section className="mt-3 mb-5">
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Updated At</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.slice(offset, offset + PER_PAGE).map((tag) => {
                return (
                  <tr key={tag.id}>
                    <th scope="row">{tag.id}</th>
                    <td>{tag.name}</td>
                    <td>{dayjs(tag.updatedAt).toString()}</td>
                    <td className="text-right d-flex flex-column flex-md-row justify-content-around">
                      <a
                        className="btn btn-primary"
                        onClick={() => {
                          window.location.href = `/admin/tags/edit/${tag.id}`;
                        }}
                      >
                        Edit
                      </a>
                      <a
                        className="btn btn-danger"
                        onClick={() => {
                          setDeleteAlert({
                            show: true,
                            id: tag.id,
                          });
                        }}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="position-relative mt-5">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={
                "pagination position-absolute top-50 start-50 translate-middle"
              }
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
        </section>
      </div>

      <SweetAlert
        show={deleteAlert.show}
        custom
        title=""
        showCancel
        showCloseButton
        confirmBtnText="Yes"
        cancelBtnText="Noا"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        onConfirm={() => {
          deleteTags(deleteAlert.id);
          setDeleteAlert({ show: false, id: "" });
        }}
        onCancel={() => setDeleteAlert({ show: false, id: "" })}
      >
        DELETE?
      </SweetAlert>
    </div>
  );
}
