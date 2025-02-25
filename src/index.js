import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  onGetBooks,
  saveBook,
  deleteBook,
  getBook,
  updateBook,
  getBooks,
  auth,
} from "./app/firebase.js";

import "./app/signIn.js";
import "./app/logout.js";
import { loginCheck } from "./app/loginCheck.js";
import { showMessage } from "./app/showMessage.js";

onAuthStateChanged(auth, async (user) => {
  const body = document.querySelector("body");
  const existingMessageDiv = document.getElementById("auth-warning");

  if (user) {
    loginCheck(user);

    // Eliminar el mensaje de advertencia si existe
    if (existingMessageDiv) {
      body.removeChild(existingMessageDiv);
    }

    const bookForm = document.getElementById("book-form");
    const booksContainer = document.getElementById("books-container");
    const butonCancel = document.getElementById("btn-book-cancel");

    let editStatus = false;
    let id = "";

    const querySnapshot = await getBooks();
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });

    onGetBooks((querySnapshot) => {
      booksContainer.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const book = doc.data();

        booksContainer.innerHTML += `
          <div class="card card-body mt-2 border-primary">
            <h3 class="h5">${book.title}</h3>
            <p>Author - ${book.author}</p>
            <p>Genre - ${book.genre}</p>
            <p>Raiting - ${book.raiting}</p>
            <div>
              <button class="btn btn-primary btn-delete" data-id="${doc.id}">
                🗑 Delete
              </button>
              <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
                🖉 Edit
              </button>
            </div>
          </div>`;
      });

      const btnsDelete = booksContainer.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async ({ target: { dataset } }) => {
          try {
            await deleteBook(dataset.id);
          } catch (error) {
            console.log(error);
          }
        })
      );

      const btnsEdit = booksContainer.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          try {
            const doc = await getBook(e.target.dataset.id);
            const book = doc.data();
            bookForm["book-title"].value = book.title;
            bookForm["book-author"].value = book.author;
            bookForm["book-genre"].value = book.genre;
            bookForm["book-raiting"].value = book.raiting;

            editStatus = true;
            id = doc.id;
            bookForm["btn-book-form"].innerText = "Update";
          } catch (error) {
            console.log(error);
          }
        });
      });
    });

    bookForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = bookForm["book-title"];
      const author = bookForm["book-author"];
      const genre = bookForm["book-genre"];
      const raiting = bookForm["book-raiting"];

      if (!title.value || !author.value || !genre.value || !raiting.value) {
        return showMessage("Please fill all the fields", "error");
      }

      try {
        if (!editStatus) {
          await saveBook(title.value, author.value, genre.value, raiting.value);
          showMessage("Book Added Successfully", "success");
        } else {
          await updateBook(id, {
            title: title.value,
            author: author.value,
            genre: genre.value,
            raiting: raiting.value,
          });

          editStatus = false;
          id = "";
          bookForm["btn-book-form"].innerText = "Save";
          showMessage("Book Updated Successfully", "success");
        }

        bookForm.reset();
        title.focus();
      } catch (error) {
        console.log(error);
      }
    });

    butonCancel.addEventListener("click", (e) => {
      bookForm.reset();

      editStatus = false;
      id = "";
    });
  } else {
    console.log("No user");
    loginCheck(user);
    if (!existingMessageDiv) {
      const messageDiv = document.createElement("div");
      messageDiv.id = "auth-warning";
      messageDiv.className = "alert alert-warning";
      messageDiv.textContent =
        "Please note that registration is required to view the list of registered books.";
      messageDiv.style.maxWidth = "600px";
      messageDiv.style.margin = "20px auto";
      messageDiv.style.textAlign = "center";
      body.appendChild(messageDiv);
    }
  }
});
