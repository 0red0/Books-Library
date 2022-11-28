const books = document.querySelector(".books");
const overlay = document.querySelector(".overlay");
const newBtn = document.querySelector(".new");
const addBtn = document.querySelector(".add-btn");
const editBtn = document.querySelector(".edit-btn");
const form = document.querySelector(".popup form");
const inputFields = document.querySelectorAll(".popup input");

let myLibrary = [];

// myLibrary = [
//    {
//       title: "book324",
//       author: "me",
//       pages: 500,
//       read: true,
//    },
//    {
//       title: "book2",
//       author: "you",
//       pages: 5000,
//       read: false,
//    },
//    {
//       title: "book3",
//       author: "someone",
//       pages: 570,
//       read: true,
//    },
// ];

function addLocalStorage() {
   if (
      localStorage.getItem("library") ||
      localStorage.getItem("library") != "" ||
      localStorage.getItem("library") != null
   ) {
      myLibrary = JSON.parse(localStorage.getItem("library"));
      saveRender();
   }
}
addLocalStorage();
// saveRender();

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
         // bookItem.classList.remove("read-unchecked");
         // bookItem.classList.add("read-checked");
         geekmark.classList.toggle("hidden");

         book.read = true;
         saveRender();
      } else {
         // bookItem.classList.remove("read-checked");
         // bookItem.classList.add("read-unchecked");
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
   bookItem.setAttribute("id", book.id);
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
      editBook(index);
   });
}

function deleteBook(index) {
   myLibrary.splice(index, 1);
   saveRender();
}

function editBook(index) {
   overlay.style.transform = "scale(1)";
   overlay.style.opacity = "1";
   // console.log(myLibrary[index]);
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
   // inputFields.forEach((inp) => (inp.value = ""));
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
      console.log("empty no boos");
      books.innerText = "Add New Books ..!";
   }
};

/// Add new book

form.addEventListener("submit", makeObj);

function makeObj(e) {
   e.preventDefault();
   const myFormData = new FormData(e.target);
   // https://stackabuse.com/convert-form-data-to-javascript-object/
   // const formDataObj = Object.fromEntries(myFormData.entries())
   let formDataObj = {};
   myFormData.forEach((value, name) => (formDataObj[name] = value));
   if (formDataObj.title == "") return;
   if()
   formDataObj = new Book(
      formDataObj.title,
      formDataObj.author,
      formDataObj.pages,
      formDataObj.id
   );
   let id = formDataObj.id;
   formDataObj = myLibrary.filter((b) => b.id === id)[0];
   addBookToLibrary(
      formDataObj.title,
      formDataObj.author,
      formDataObj.pages,
      formDataObj.id,
      false
   );
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

function addBookToLibrary(title, author, pages, read, id) {
   myLibrary.push(new Book(title, author, pages, read, id));
   saveRender();
}

/// Edit books
editBtn.addEventListener("click", () => {
   overlay.style.transform = "translateY(100%)";
   overlay.style.opacity = "0";
});
