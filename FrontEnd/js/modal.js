const modal = document.getElementById("myModal");
const modify = document.getElementById("modify");
const closeX = document.getElementsByClassName("close")[0];
const back = document.getElementsByClassName("back")[0];
const token = sessionStorage.getItem('token');

modify.onclick = function () {
  modal.style.display = "block";
  getWorksModal();
}

back.onclick = function () {
  modal.style.display = "block";
  getWorksModal();
}

closeX.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function getWorksModal() {
  back.style.display = "none";
  fetch("http://localhost:5678/api/works", {})
    .then(listWorks => listWorks.json())
    .then(jsonListWorks => {
      if (currentCategory) {
        jsonListWorks = jsonListWorks.filter(function (work) { return work.category.id == currentCategory });
      }
      document.querySelector(".modalGallery").innerHTML = "<h2>Galerie photo</h2>";
      for (let jsonWork of jsonListWorks) {
        let work = new Work(jsonWork);
        let workElement = document.createElement("figure");
        workElement.innerHTML += `
              <div class="modalImageContainer">
                <img crossorigin="anonymous" src=${work.imageUrl} alt="IMAGE" style="display: block">
                <a href="#" class="delete-icon">
                  <i class="fa-regular fa-trash-can"></i>
                </a>
              </div>
              <figcaption>${work.title}</figcaption>
            `;
        let deleteIcon = workElement.querySelector(".delete-icon");
        deleteIcon.addEventListener("click", () => {
          let deleteWork = confirm("Voulez vous supprimer ce travail?");
          if (deleteWork) {
            fetch(`http://localhost:5678/api/works/${work.id}`, {
              method: "DELETE",
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                window.location.href = "index.html";
                return response.json();
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        });
        document.querySelector(".modalGallery").appendChild(workElement);
      }

      const modalFooter = document.createElement('div');
      modalFooter.className = "modalFooter";

      const line = document.createElement('img');
      line.className = "line";
      line.src = "./assets/icons/Line 1.svg";

      const addPhoto = document.createElement('button');
      addPhoto.innerText = "Ajouter une photo";

      const supPhoto = document.createElement('a');
      supPhoto.innerText = "Supprimer la galerie"
      supPhoto.href = "#";

      modalFooter.appendChild(line);
      modalFooter.appendChild(addPhoto);
      modalFooter.appendChild(supPhoto);
      document.querySelector(".modalGallery").appendChild(modalFooter);
      supPhoto.addEventListener("click", () => {
        let deleteAll = confirm("Voulez-vous supprimer tous les travaux?");
        if (deleteAll) {
          fetch("http://localhost:5678/api/works", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((works) => {
              works.forEach((work) => {
                fetch(`http://localhost:5678/api/works/${work.id}`, {
                  method: "DELETE",
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    return response.json();
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              });
              window.location.href = "index.html";
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      });

      const addPhotoButton = document.querySelector(".modalFooter button");

      addPhotoButton.addEventListener("click", () => {
        back.style.display = "block";
        document.querySelector(".modalGallery").innerHTML = "<h2>Ajout photo</h2>";

        const inputContainer = document.createElement('div');
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('file-input-container');

        const iconElement = document.createElement('i');
        iconElement.classList.add('fa-regular', 'fa-image');
        photoContainer.appendChild(iconElement);

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.name = 'photo';
        input.required = true;
        input.classList.add('file-input');
        input.style.display = 'none';

        const customButton = document.createElement('button');
        customButton.innerText = "+ Ajouter photo";
        customButton.classList.add('file-input-button');
        customButton.addEventListener('click', () => {
          input.click();
        });

        const subtitle = document.createElement('div');
        subtitle.classList.add('subtitle');
        subtitle.textContent = 'jpg, png : 4mo max';

        photoContainer.appendChild(iconElement);
        photoContainer.appendChild(input);
        photoContainer.appendChild(customButton);
        photoContainer.appendChild(subtitle);

        inputContainer.appendChild(photoContainer);

        input.addEventListener('change', () => {
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            const image = document.createElement('img');
            image.src = event.target.result;
            image.style.background = "#E8F1F7"
            image.id = "image";
            inputContainer.replaceChild(image, photoContainer);
          };
          reader.readAsDataURL(file);
        });

        const title = document.createElement('input');
        title.type = "text";
        title.name = "Titre"
        title.value = "";
        title.required = true;
        title.id = "title";

        var titLabel = document.createElement('label');
        titLabel.innerHTML = "Titre";
        var catLabel = document.createElement('label');
        catLabel.innerHTML = "Catégorie";
        const categorySelect = document.createElement("select");
        categorySelect.setAttribute("name", "category_id");
        categorySelect.required = true;
        categorySelect.id = "category";

        const defaultCategoryOption = document.createElement("option");
        defaultCategoryOption.setAttribute("value", "");
        categorySelect.appendChild(defaultCategoryOption);
        const categoriesWithoutAll = categories.slice(1);
        categoriesWithoutAll.forEach(category => {
          const option = document.createElement("option");
          option.setAttribute("value", category.id);
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });

        const button = document.createElement('button');
        button.className = "submitButton"
        button.textContent = 'Valider';
        button.type = 'submit';

        const form = document.createElement('form');
        form.setAttribute('enctype', 'multipart/form-data');
        form.appendChild(inputContainer);
        form.appendChild(titLabel);
        form.appendChild(title);
        form.appendChild(catLabel);
        form.appendChild(categorySelect);
        form.appendChild(line);
        form.appendChild(button);

        document.querySelector(".modalGallery").appendChild(form);

        form.addEventListener('input', () => {
          if (form.checkValidity()) {
            button.style.backgroundColor = '#1D6154';
          }
        });
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const title = document.getElementById("title").value;
          const category = document.getElementById("category").value;

          const formData = new FormData(); 
          formData.append('category', category);
          formData.append('title', title); 
          formData.append('image', input.files[0]); 

          fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              getWorksModal();
              return response.json();
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });

      });
    });
}