const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");

    window.location.href = "index.html";
});