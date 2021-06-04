const login = async (e) => {
  e.preventDefault();
  let username = document.querySelector("#inputUsername");
  let password = document.querySelector("#inputPassword");
  await fetch(`http://localhost:3000/users/login`, {
    method: "POST",
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        Swal.fire({
          title: "Error!",
          text: data.error,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        localStorage.setItem("token", data.accessToken);
        window.location.href = "/";
      }
    });
};
