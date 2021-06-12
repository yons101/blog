const checkAuth = async (setAuthorized) => {
  let token = localStorage.getItem("token");
  let status;
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
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200 && (data.role === "admin" || data.role === "author")) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        window.location.href = "/logout";
      }
      localStorage.setItem("UserId", data.id);
    });
};

export { checkAuth };
