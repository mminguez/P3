let form = document.getElementsByTagName("form")[0];
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error("Erreur dans l'identifiant ou le mot de passe");
      }
      return response.json(); 
    })
    .then(data => {
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('isLoggedIn', true);
      window.location.href = "index.html";
    }) 
    .catch(error => {
      alert(error.message);
    });
});