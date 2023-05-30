const toyAPI = 'http://localhost:3000/toys';
const toyCollectionElement = document.getElementById('toy-collection');
const addToyForm = document.getElementById('add-toy-form');

const headers = {
  Accept: 'application/json',
  'Content-type': 'application/json',
}

// Toggle Add New Toy
let showAddToyForm = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
addBtn.addEventListener("click", () => {
  showAddToyForm = !showAddToyForm;
  toyFormContainer.style.display = showAddToyForm ? 'block' : 'none';
});

function renderPage(){
  fetch(toyAPI)
    .then(resp => resp.json())
    .then(toys => {
      toys.forEach((toy) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;

        toyCollectionElement.append(card);

        document.getElementById(toy.id).addEventListener('click', (event) => {
          fetch(`${toyAPI}/${toy.id}`, {
            headers,
            method: 'PATCH',
            body: JSON.stringify({
              likes: toy.likes + 1
            })
          })
            .then(resp => resp.json())
            .then(data => {
              toyCollectionElement.innerHTML = '';
              renderPage();
            })
        })
      })
    })
}

addToyForm.addEventListener('submit', (event) => {
  event.preventDefault();

  fetch(toyAPI, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    })
  })
    .then((resp) => resp.json())
    .then((data) => {
      event.target.name.value = '';
      event.target.image.value = '';
      toyCollectionElement.innerHTML = '';
      renderPage();
    })
})

renderPage();