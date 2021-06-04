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

buildPagination();
navigate();
