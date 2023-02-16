let currentCategory = null;
const isLoggedIn = sessionStorage.getItem("isLoggedIn");

if (isLoggedIn) {
  document.getElementById("login").style.display = "none";
  document.getElementById("logout").style.display = "block";
}

const categories = [
    { id: null, name: "Tous" },
    { id: 1, name: "Objets" },
    { id: 2, name: "Appartements" },
    { id: 3, name: "Hôtels & restaurants" },
];


const buttonContainer = document.querySelector(".filter");
for (const category of categories) {
    const button = document.createElement("button");
    button.id = `cat-${category.id}`;
    button.textContent = category.name;
    button.addEventListener("click", () => {
        currentCategory = category.id;
        filterWorksByCategory();
        button.classList.add("active");
        for (const otherButton of buttonContainer.querySelectorAll("button")) {
            if (otherButton !== button) {
                otherButton.classList.remove("active");
            }
        }
    });
    buttonContainer.appendChild(button);
}

const allButton = document.getElementById("cat-null");
allButton.classList.add("active");

filterWorksByCategory();

function filterWorksByCategory() {
    fetch("http://localhost:5678/api/works", {})
        .then(listWorks => listWorks.json())
        .then(jsonListWorks => {
            if (currentCategory) {
                jsonListWorks = jsonListWorks.filter(function(work) { return work.category.id == currentCategory});
            }
            document.querySelector(".gallery").innerHTML = "";
            for (let jsonWork of jsonListWorks) {
                let work = new Work(jsonWork);
                document.querySelector(".gallery").innerHTML +=
                    `<figure>
                        <img crossorigin="anonymous"  src=${work.imageUrl} alt="IMAGE">
                        <figcaption>${work.title}</figcaption>
                    </figure>`
            }
        });
}