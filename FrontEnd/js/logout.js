const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("isLoggedIn");

    window.location.href = "index.html";
});