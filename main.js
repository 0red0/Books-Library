const books = document.querySelector(".books");
const newBook = document.querySelector(".new");

let myLibrary = [
   {
      title: "book1",
      author: "me",
      pages: 500,
      read: true,
   },
   {
      title: "book2",
      author: "you",
      pages: 5000,
      read: false,
   },
   {
      title: "book3",
      author: "someone",
      pages: 570,
      read: true,
   },
];

function addLocalStorage() {
   myLibrary = JSON.parse(localStorage.getItem("library"));
   saveRender();
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
         bookItem.classList.remove("read-unchecked");
         bookItem.classList.add("read-checked");
         geekmark.classList.toggle("hidden");

         book.read = true;
         saveRender();
      } else {
         bookItem.classList.remove("read-checked");
         bookItem.classList.add("read-unchecked");
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
}

function deleteBook(index) {
   myLibrary.splice(index, 1);
   saveRender();
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
