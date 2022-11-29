const books = document.querySelector(".books");
const overlay = document.querySelector(".overlay");
const newBtn = document.querySelector(".new");
const addBtn = document.querySelector(".add-btn");
const updateBtn = document.querySelector(".update-btn");
const form = document.querySelector(".popup form");
const inputFields = document.querySelectorAll(".popup input");

let myLibrary = [];

function addLocalStorage() {
   let check1 = localStorage.getItem("library");
   if (check1 == "null" || check1 == "" || check1 == []) {
      books.innerText = "Add New Book ..!";
      // console.log("check1");
   } else {
      myLibrary = JSON.parse(localStorage.getItem("library"));
      saveRender();
      // console.log("check2");
   }
}
addLocalStorage();

function createBookElement(el, content, className) {
   const element = document.createElement(el);
   element.textContent = content;
   element.setAttribute("class", className);
   return element;
}

function createReadElement(bookItem, book) {
   let read = document.createElement("label");
   read.classList.add("book-read");
   read.append(createBookElement("p", "Read?", "book-read-title"));
   let input = document.createElement("input");
   input.type = "checkbox";
   let geekmark = document.createElement("span");
   geekmark.classList.add("geekmark");

   input.onchange = () => {
      if (input.checked) {
         geekmark.classList.toggle("hidden");

         book.read = true;
         saveRender();
      } else {
         geekmark.classList.toggle("hidden");

         book.read = false;
         saveRender();
      }
   };

   if (book.read) {
      input.checked = true;
      bookItem.classList.add("read-checked");
      bookItem.style.borderLeftColor = "var(--colorC)";
   }
   read.append(input);
   read.append(geekmark);
   return read;
}

function createBookItem(book, index) {
   const bookItem = document.createElement("div");
   bookItem.setAttribute("id", index);
   bookItem.setAttribute("key", index);
   bookItem.setAttribute("class", "card book box");
   bookItem.append(
      createBookElement("h3", `Title: ${book.title}`, "book-title")
   );
   bookItem.append(
      createBookElement("p", `Author: ${book.author}`, "book-author")
   );
   bookItem.append(
      createBookElement("p", `pages: ${book.pages}`, "book-pages")
   );
   bookItem.append(createReadElement(bookItem, book));

   let icons = document.createElement("div");
   icons.classList.add("icons");
   let edit = document.createElement("i");
   edit.classList.add("fa-solid", "fa-pen");
   let see = document.createElement("i");
   see.classList.add("fa-regular", "fa-eye");
   let del = document.createElement("i");
   del.classList.add("fa-solid", "fa-trash");
   let shr = document.createElement("i");
   shr.classList.add("fa-solid", "fa-share-nodes");
   icons.append(edit, see, del, shr);

   bookItem.append(icons);
   books.append(bookItem);

   del.addEventListener("click", () => {
      deleteBook(index);
   });
   edit.addEventListener("click", () => {
      editBook(book, index);
   });
}

function deleteBook(index) {
   myLibrary.splice(index, 1);
   saveRender();
}

function editBook(book, index) {
   overlay.style.transform = "scale(1)";
   overlay.style.opacity = "1";
   inputFields.forEach((inp) => {
      if (inp.name == "title") {
         inp.value = `${myLibrary[index].title}`;
      }
      if (inp.name == "author") {
         inp.value = `${myLibrary[index].author}`;
      }
      if (inp.name == "pages") {
         inp.value = `${myLibrary[index].pages}`;
      }
   });
   form.id = book.id;
}

function renderBooks() {
   books.innerText = "";
   myLibrary.map((book, index) => {
      createBookItem(book, index);
   });
}

function saveRender() {
   localStorage.setItem("library", JSON.stringify(myLibrary));
   renderBooks();
}

// overlay handling
newBtn.addEventListener("click", () => {
   overlay.style.transform = "scale(1)";
   overlay.style.opacity = "1";
   inputFields.forEach((inp) => (inp.value = ""));
});
addBtn.addEventListener("click", () => {
   overlay.style.transform = "translateY(100%)";
   overlay.style.opacity = "0";
});

window.addEventListener("click", (e) => {
   if (e.target.classList.contains("overlay")) {
      overlay.style.transform = "scale(0)";
      overlay.style.opacity = "0";
   }
});

window.onload = () => {
   if (books.innerHTML == "") {
      books.innerText = "Add New Books ..!";
   }
};

/// Add new book

form.addEventListener("submit", makeObj);

function makeObj(e) {
   e.preventDefault();
   let submitter = e.submitter;
   if (submitter.classList.contains("add-btn")) {
      const myFormData = new FormData(e.target);
      // https://stackabuse.com/convert-form-data-to-javascript-object/
      // const formDataObj = Object.fromEntries(myFormData.entries())
      let formDataObj = {};
      myFormData.forEach((value, name) => (formDataObj[name] = value));
      if (formDataObj.title == "") return;
      addBookToLibrary(
         formDataObj.title,
         formDataObj.author,
         formDataObj.pages,
         false
      );
   }
}

class Book {
   constructor(title, author, pages, read) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.read = read;
      this.id = Date.now();
   }
}

function addBookToLibrary(title, author, pages, read) {
   myLibrary.push(new Book(title, author, pages, read));
   saveRender();
}

/// Update books info
updateBtn.addEventListener("click", () => {
   overlay.style.transform = "translateY(100%)";
   overlay.style.opacity = "0";
   updateBook();
});

function updateBook() {
   let id = form.id;
   let book = myLibrary.filter((x) => x.id == id)[0];
   let newTitle;
   let newAuthor;
   let newPages;
   inputFields.forEach((inp) => {
      if (inp.name == "title") {
         newTitle = inp.value;
      }
      if (inp.name == "author") {
         newAuthor = inp.value;
      }
      if (inp.name == "pages") {
         newPages = inp.value;
      }
   });
   book.title = newTitle;
   book.author = newAuthor;
   book.pages = newPages;
   saveRender();
}
