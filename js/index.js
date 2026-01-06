const BASE_URL = "http://localhost:3000/books";

const currentUser = { id: 1, username: "pouros" };

document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});

function fetchBooks() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(books => renderBookList(books));
}

function renderBookList(books) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  books.forEach(book => {
    const li = document.createElement("li");
    li.textContent = book.title;
    li.addEventListener("click", () => showBookDetails(book.id));
    list.appendChild(li);
  });
}

function showBookDetails(bookId) {
  fetch(`${BASE_URL}/${bookId}`)
    .then(res => res.json())
    .then(book => renderBookDetails(book));
}

function renderBookDetails(book) {
  const panel = document.getElementById("show-panel");
  panel.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = book.title;

  const img = document.createElement("img");
  img.src = book.img_url;

  const desc = document.createElement("p");
  desc.textContent = book.description;

  const usersList = document.createElement("ul");

  book.users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.username;
    usersList.appendChild(li);
  });

  const likeBtn = document.createElement("button");
  likeBtn.textContent = "LIKE";

  likeBtn.addEventListener("click", () => {
    toggleLike(book);
  });

  panel.append(title, img, desc, usersList, likeBtn);
}

function toggleLike(book) {
  const userIndex = book.users.findIndex(
    user => user.id === currentUser.id
  );

  let updatedUsers;

  if (userIndex === -1) {
    // LIKE
    updatedUsers = [...book.users, currentUser];
  } else {
    // UNLIKE
    updatedUsers = book.users.filter(
      user => user.id !== currentUser.id
    );
  }

  fetch(`${BASE_URL}/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      users: updatedUsers
    })
  })
    .then(res => res.json())
    .then(updatedBook => renderBookDetails(updatedBook));
}
