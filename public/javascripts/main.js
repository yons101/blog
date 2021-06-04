const users = document.querySelector("#users");
const pagination = document.querySelector("#pagination");

let paginationState = {
  offset: 0,
  limit: 5,
  page: 1,
  count: 0,
};
const navigate = async (e = null, offset = 0, limit = 5) => {
  //if it's not the first load
  if (e) {
    //if we click on Previous
    if (e.target.attributes.direction.value === "prev") {
      paginationState.offset -= 5;
      paginationState.page--;
    }
    //if we click on Next
    else if (e.target.attributes.direction.value === "next") {
      paginationState.offset += 5;
      paginationState.page++;
    }
    //if we click on a page number
    else {
      paginationState.offset = offset;
      paginationState.limit = limit;
      paginationState.page = e.target.innerText;
    }
  }

  users.innerHTML = "";
  await fetch(
    `http://localhost:3000/users/${paginationState.offset}/${paginationState.limit}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.map((user) => {
        users.innerHTML += `
        <tr>
            <th scope="row">${user.id}</th>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td class="text-right">
              <a class="btn btn-primary" onclick="updateUser(event, ${user.id}, '${user.username}', '${user.email}')">Edit</a>
              <a class="btn btn-danger" onclick="deleteUser(event, ${user.id})">Delete</a>
            </td>
        </tr>`;
      });
    });

  buildPagination(paginationState.page);
};

const buildPagination = async (page = 1, offset = 0, limit = 5) => {
  //clear the pagination first
  pagination.innerHTML = "";

  //add the previous button
  pagination.innerHTML += `
  <li ${
    paginationState.offset - 5 < 0
      ? 'class="page-item disabled"'
      : 'class="page-item"'
  }>
        <a class="page-link" href="#" onclick="navigate(event)" direction="prev">Previous</a>
    </li>`;
  await fetch(`http://localhost:3000/users`)
    .then((response) => response.json())
    .then((data) => {
      paginationState.count = data.length;
      data.slice(offset, Math.round(data.length / 5)).map((user, i) => {
        //add page number buttons
        pagination.innerHTML += `
        <li ${page == i + 1 ? 'class="page-item active"' : 'class="page-item"'}>
            <a class="page-link" href="#" onclick="navigate(event, ${offset},${limit})" direction="page">${
          i + 1
        }</a>
        </li>`;
        offset += 5;
      });
    });
  //add the next button
  pagination.innerHTML += `
      <li ${
        paginationState.offset + 5 < paginationState.count
          ? 'class="page-item"'
          : 'class="page-item disabled"'
      }>
          <a class="page-link" href="#" onclick="navigate(event)" direction="next">Next</a>
      </li>`;
};
const checkAuth = async (e) => {
  let token = localStorage.getItem("token");
  await fetch(`http://localhost:3000/users/check-auth`, {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.error) {
        window.location.href = "/login.html";
      }
    });
};

const addUser = async (event) => {
  Swal.fire({
    // title: "",
    html: `<form  method="post" onsubmit="addUser(event)">
      <tr>
        <td>Username:</td>
        <td><input value="username" id="username" type="text" class="form-control"></td>
      </tr>
      <tr>
        <td>Email:</td>
        <td><input value="email@email.cc" id="email" type="email" class="form-control"></td>
      </tr>
      <tr>
        <td>Password:</td>
        <td><input value="password123" id="password" type="password" class="form-control"></td>
      </tr>
      <tr>
        <td>Role:</td>
        <td>
          <select id="role" class="form-control">
            <option value="admin">admin</option>
            <option selected value="author">author</option>
            <option value="guest">guest</option>
          </select>
        </td>
      </tr>
    </form>
  </div>`,
    confirmButtonText: "Add User",
    focusConfirm: false,
  }).then(async (result) => {
    let token = localStorage.getItem("token");
    if (result.isConfirmed) {
      await fetch(`http://localhost:3000/users`, {
        method: "POST",
        body: JSON.stringify({
          username: Swal.getPopup().querySelector("#username").value,
          email: Swal.getPopup().querySelector("#email").value,
          password: Swal.getPopup().querySelector("#password").value,
          role: Swal.getPopup().querySelector("#role").value,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            Swal.fire({
              title: "Error!",
              text: data.error,
              icon: "error",
              confirmButtonText: "OK",
            });
          } else {
            Swal.f;
            ire({
              title: "Success!",
              text: "Success",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        });
    }
  });
};

const updateUser = async (event, id, username, email) => {
  Swal.fire({
    // title: "",
    html: `<form  method="post" onsubmit="addUser(event)">
      <tr>
        <td>Username:</td>
        <td><input value=${username} id="username" type="text" class="form-control"></td>
      </tr>
      <tr>
        <td>Email:</td>
        <td><input value=${email} id="email" type="email" class="form-control"></td>
      </tr>
      <tr>
        <td>Password:</td>
        <td><input id="password" type="password" class="form-control"></td>
      </tr>
      <tr>
        <td>Role:</td>
        <td>
          <select id="role" class="form-control">
            <option value="admin">admin</option>
            <option selected value="author">author</option>
            <option value="guest">guest</option>
          </select>
        </td>
      </tr>
    </form>
  </div>`,
    confirmButtonText: "Update User",
  }).then(async (result) => {
    let token = localStorage.getItem("token");
    if (result.isConfirmed) {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          username: Swal.getPopup().querySelector("#username").value,
          email: Swal.getPopup().querySelector("#email").value,
          password: Swal.getPopup().querySelector("#password").value,
          role: Swal.getPopup().querySelector("#role").value,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            Swal.fire({
              title: "Error!",
              text: data.error,
              icon: "error",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Success!",
              text: "Success",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        });
    }
  });
};

const deleteUser = async (event, userId) => {
  event.preventDefault();
  let token = localStorage.getItem("token");
  Swal.fire({
    title: "Are you sure you want to delete?",
    showDenyButton: true,
    confirmButtonText: `Yes`,
    denyButtonText: `No`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            Swal.fire({
              title: "Error!",
              text: data.error,
              icon: "error",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Success!",
              text: "Success",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        });
    }
  });
};

const logout = async (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.href = "/login.html";
};

checkAuth();

buildPagination();
navigate();
