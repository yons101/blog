import { useState, useEffect } from "react";
import Head from "next/head";

import SweetAlert from "react-bootstrap-sweetalert";
import ReactPaginate from "react-paginate";
import { checkAuth } from "@utils/auth";

export default function index() {
  const [authorized, setAuthorized] = useState(0);
  const [users, setUsers] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState({ show: false, id: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const fetchUsers = async () => {
    const res = await fetch(`http://localhost:3000/users`);
    const users = await res.json();
    setUsers(users);
  };
  useEffect(() => {
    checkAuth(setAuthorized);
    fetchUsers();
  }, []);
  const deleteUser = async (id) => {
    let token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        fetchUsers();
        console.log(data);
      });
  };
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const PER_PAGE = 5;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(users.length / PER_PAGE);
  return (
    <div>
      <Head>
        <title>All Users</title>
      </Head>

      {authorized === 2 ? (
        <div className="container">
          <header className="mb-4 d-flex justify-content-between align-items-center">
            <h1 className="fw-bolder mb-1">All Users</h1>
            <a className="btn btn-primary" href="/admin/users/add">
              Add a user
            </a>
          </header>
          <section className="mt-3 mb-5">
            <table className="table table-striped mt-4">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(offset, offset + PER_PAGE).map((user) => {
                  return (
                    <tr key={user.id}>
                      <th scope="row">{user.id}</th>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="text-right d-flex flex-column flex-md-row justify-content-around">
                        <a
                          className="btn btn-primary"
                          onClick={() => {
                            window.location.href = `/admin/users/edit/${user.id}`;
                          }}
                        >
                          Edit
                        </a>
                        <a
                          className="btn btn-danger"
                          onClick={() => {
                            setDeleteAlert({
                              show: true,
                              id: user.id,
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
      ) : (
        <div
          class="authorization-alert container d-flex justify-content-center alert alert-danger"
          role="alert"
        >
          You are not authorized
        </div>
      )}

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
          deleteUser(deleteAlert.id);
          setDeleteAlert({ show: false, id: "" });
        }}
        onCancel={() => setDeleteAlert({ show: false, id: "" })}
      >
        DELETE?
      </SweetAlert>
    </div>
  );
}
