const modal = document.getElementById("myModal");
const modify = document.getElementById("modify");
const closeX = document.getElementsByClassName("close")[0];
const back = document.getElementsByClassName("back")[0];
const token = sessionStorage.getItem('token');

modify.onclick = function() {
  modal.style.display = "block";
  getWorksModal();
}

back.onclick = function() {
  modal.style.display = "block";
  getWorksModal();
}

closeX.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
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
                jsonListWorks = jsonListWorks.filter(function(work) { return work.category.id == currentCategory});
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
        
          
          const addPhotoButton = document.querySelector(".modalFooter button");
          const deleteGalleryButton = document.querySelector(".modalFooter a");


          deleteGalleryButton.addEventListener("click", () => {
            const deleteGallery = confirm("Être vous sûr de vouloir supprimer toute la galerie?");
            if (deleteGallery) {
              // DELETE all works in the gallery
              fetch("http://localhost:5678/api/works", {
                method: "DELETE",
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  // Refresh the modal content
                  getWorksModal();
                  return response.json();
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          });
          addPhotoButton.addEventListener("click", () => {
            // Clear the modal content
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
                inputContainer.replaceChild(image, photoContainer);
              };
              reader.readAsDataURL(file);
            });

            const title = document.createElement('input');
            title.type = "text";
            title.name = "Titre"
            title.value = "";
            title.required = true;
            var titLabel = document.createElement('label');
            titLabel.innerHTML = "Titre";
            var catLabel = document.createElement('label');
            catLabel.innerHTML = "Catégorie";  
            const categorySelect = document.createElement("select");
            categorySelect.setAttribute("name", "category_id");
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

            // create the button to trigger the upload
            const button = document.createElement('button');
            button.textContent = 'Valider';
            button.type = 'submit';

            // add the input field and button to a form element
            const form = document.createElement('form');
            form.appendChild(inputContainer);
            form.appendChild(titLabel);
            form.appendChild(title);
            form.appendChild(catLabel);
            form.appendChild(categorySelect);
            form.appendChild(line);
            form.appendChild(button);
            
            document.querySelector(".modalGallery").appendChild(form);


            // Event listener for form submission
            form.addEventListener("submit", (event) => {
              event.preventDefault();
              const title = document.getElementById("title").value;
              const category = document.getElementById("category").value;
              const imageUrl = document.getElementById("imageUrl").value;

              // POST the new work to the server
              fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, category, imageUrl })
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  // Refresh the modal content
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
