let books = [];

// Load buku dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('books')) {
    books = JSON.parse(localStorage.getItem('books'));
  }
  renderBooks();
});

// Tambahkan event listener untuk form tambah buku
document.getElementById('bookForm').addEventListener('submit', (event) => {
  event.preventDefault();
  addBook();
});

// Event listener untuk tombol pencarian
document.getElementById('searchBook').addEventListener('submit', (event) => {
  event.preventDefault();
  const searchQuery = document.getElementById('searchBookTitle').value;
  renderBooks(searchQuery);
});

// Fungsi untuk menambahkan buku
function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
  document.getElementById('bookForm').reset();
}

// Simpan ke LocalStorage
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Render Buku
function renderBooks(searchQuery = '') {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const filteredBooks = books.filter((book) => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredBooks.length === 0 && searchQuery) {
    const noResultElement = document.createElement('p');
    noResultElement.textContent = 'Buku tidak ditemukan';
    incompleteBookList.appendChild(noResultElement);
    return;
  }

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function createBookElement(book) {
  const bookContainer = document.createElement('div');
  bookContainer.classList.add('book-item');
  bookContainer.setAttribute('data-bookid', book.id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  bookContainer.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton" onclick="toggleBookStatus(${book.id})">
        ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
      </button>
      <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus</button>
      <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit</button>
    </div>
  `;

  return bookContainer;
}

// Hapus Buku
function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooks();
  renderBooks();
}

// Pindahkan Status Buku
function toggleBookStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  }
}

// Edit Buku
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    deleteBook(bookId);
  }
}
