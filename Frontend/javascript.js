const API_URL = "http://localhost:3000/api/books";

// دالة عامة لإظهار الرسائل بشكل جميل
function showNotify(msg, type) {
    const box = document.getElementById('statusMsg');
    box.textContent = msg;
    box.style.display = 'block';
    box.style.backgroundColor = type === 'success' ? '#d4edda' : (type === 'error' ? '#f8d7da' : '#fff3cd');
    box.style.color = type === 'success' ? '#155724' : (type === 'error' ? '#721c24' : '#856404');
    
    setTimeout(() => { box.style.display = 'none'; }, 3000);
}

// 1. جلب كل الكتب
function getAllBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            renderTable(res.data);
        }
    };
    xhr.send();
}

// 2. إضافة كتاب جديد
function addBook() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    const bookData = {
        id: parseInt(document.getElementById('bookId').value),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        categories: document.getElementById('bookCats').value.split(',').map(c => c.trim()),
        isAvailable: document.getElementById('bookStatus').value === "true"
    };

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                showNotify("Book added successfully!", "success");
                getAllBooks();
            } else {
                showNotify("Error: " + xhr.status, "error");
            }
        }
    };
    xhr.send(JSON.stringify(bookData));
}

// 3. تعديل كتاب
function updateBook() {
    const id = document.getElementById('bookId').value;
    if(!id) return showNotify("Please enter ID to update", "warning");

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `${API_URL}/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    const updatedData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        categories: document.getElementById('bookCats').value.split(',').map(c => c.trim()),
        isAvailable: document.getElementById('bookStatus').value === "true"
    };

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            showNotify("Book updated!", "success");
            getAllBooks();
        }
    };
    xhr.send(JSON.stringify(updatedData));
}

// 4. جلب كتاب واحد
function getOneBook() {
    const id = document.getElementById('searchId').value;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${API_URL}/${id}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText);
                renderTable([res.data]);
                showNotify("Found it!", "success");
            } else {
                showNotify("Book not found", "error");
            }
        }
    };
    xhr.send();
}

// 5. حذف كتاب
function deleteBook() {
    const id = document.getElementById('searchId').value;
    if(!id) return showNotify("Enter ID to delete", "warning");

    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${API_URL}/${id}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            showNotify("Book deleted from library", "success");
            getAllBooks();
        }
    };
    xhr.send();
}

// دالة رسم الجدول
function renderTable(books) {
    const tbody = document.querySelector("#libTable tbody");
    tbody.innerHTML = "";
    books.forEach(book => {
        const row = `<tr>
            <td><strong>#${book.id}</strong></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.categories.join(' | ')}</td>
            <td><span class="badge badge-${book.isAvailable}">${book.isAvailable ? 'Available' : 'Borrowed'}</span></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

window.onload = getAllBooks;