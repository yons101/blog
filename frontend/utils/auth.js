const checkAuth = async (setAuthorized) => {
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
      if (response.status === 200) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        window.location.href = "/login";
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("UserId", data.id);
    });
};

export { checkAuth };
