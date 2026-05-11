const API_URL = "http://localhost:3000/api"; 
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
    window.location.href = "login.html";
}

// --- Tab Logic ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(event) event.currentTarget.classList.add('active');

    tabId === 'usersTab' ? getAllUsers() : getAllBooks();
}

// --- Books Management ---
function getAllBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${API_URL}/admin/books`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            renderBooks(res.data);
            updateStats(res.data, null);
        }
    };
    xhr.send();
}

function renderBooks(books) {
    const tbody = document.querySelector("#booksTable tbody");
    tbody.innerHTML = "";
    books.forEach(book => {
        const borrower = book.borrowedBy ? book.borrowedBy.name : "—";
        const bookData = JSON.stringify(book).replace(/'/g, "&apos;");
        tbody.innerHTML += `
            <tr>
                <td><strong>${book.title}</strong><br><small>${book.author}</small></td>
                <td><span class="status-badge ${book.isAvailable ? 'available' : 'borrowed'}">${book.isAvailable ? 'Available' : 'Borrowed'}</span></td>
                <td>👤 ${borrower}</td>
                <td>
                    <button onclick='openModal(${bookData})' style="color:var(--primary); border:none; background:none; cursor:pointer; font-weight:bold;">Edit</button> | 
                    <button onclick="deleteBook(${book.id})" style="color:var(--danger); border:none; background:none; cursor:pointer; font-weight:bold;">Delete</button>
                </td>
            </tr>`;
    });
}

// --- Users Management ---
function getAllUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${API_URL}/admin/users`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            renderUsers(res.data);
            updateStats(null, res.data);
            
            // تخزين اليوزرز لاستخدامهم في الـ Select الخاص بالمودال
            window.allUsers = res.data.filter(u => u.role !== 'admin');
        }
    };
    xhr.send();
}

function renderUsers(users) {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";
    users.forEach(user => {
        const isAdmin = user.role === 'admin';
        tbody.innerHTML += `
            <tr>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td><span class="role-badge ${isAdmin ? 'role-admin' : 'role-user'}">${user.role}</span></td>
                <td>${isAdmin ? 'N/A' : `<span class="status-badge ${user.borrowCount > 0 ? 'borrowed' : 'available'}">${user.borrowCount} Book(s)</span>`}</td>
                <td><small>${isAdmin ? '—' : (user.titles.join(', ') || 'None')}</small></td>
            </tr>`;
    });
}

// --- CRUD Operations ---

// دالة لتحديث قائمة المستخدمين داخل المودال
function toggleUserSelect() {
    const status = document.getElementById('m_status').value;
    const container = document.getElementById('userSelectContainer');
    
    if (status === "false") {
        container.style.display = "block";
        const select = document.getElementById('m_borrower_id');
        
        // لو الداتا لسه مجتش من السيرفر، ناديها
        if (!window.allUsers) {
            getAllUsers(); 
        } else {
            select.innerHTML = window.allUsers.map(u => 
                `<option value="${u._id}">${u.name}</option>`
            ).join('');
        }
    } else {
        container.style.display = "none";
    }
}

function openModal(book = null) {
    document.getElementById('bookModal').style.display = 'flex';
    const userContainer = document.getElementById('userSelectContainer');
    
    if (book) {
        document.getElementById('modalTitle').innerText = "Edit Book";
        document.getElementById('editFlag').value = book.id;
        document.getElementById('m_id').value = book.id;
        document.getElementById('m_id').disabled = true;
        document.getElementById('m_title').value = book.title;
        document.getElementById('m_author').value = book.author;
        document.getElementById('m_cats').value = book.categories.join(', ');
        document.getElementById('m_status').value = book.isAvailable.toString();
        
        // لو الكتاب مستعار، اظهر اليوزر
        if (!book.isAvailable) {
            userContainer.style.display = "block";
            const select = document.getElementById('m_borrower_id');
            // تأكد إن اليوزرز موجودين
            if (window.allUsers) {
                select.innerHTML = window.allUsers.map(u => 
                    `<option value="${u._id}" ${book.borrowedBy && book.borrowedBy._id === u._id ? 'selected' : ''}>${u.name}</option>`
                ).join('');
            }
        } else {
            userContainer.style.display = "none";
        }
    } else {
        document.getElementById('modalTitle').innerText = "Add Book";
        document.getElementById('editFlag').value = "";
        document.getElementById('m_id').disabled = false;
        userContainer.style.display = "none";
        document.querySelectorAll('.modal-content input').forEach(i => i.value = "");
        document.getElementById('m_status').value = "true";
    }
}

function closeModal() { document.getElementById('bookModal').style.display = 'none'; }

function saveBook() {
    const editId = document.getElementById('editFlag').value;
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/books/${editId}` : `${API_URL}/books`;

    const isAvail = document.getElementById('m_status').value === "true";
    
    const data = {
        id: parseInt(document.getElementById('m_id').value),
        title: document.getElementById('m_title').value,
        author: document.getElementById('m_author').value,
        categories: document.getElementById('m_cats').value.split(',').map(c => c.trim()),
        isAvailable: isAvail,
        // إرسال الـ ID الخاص بالمستخدم إذا كانت الحالة "Borrowed"
        borrowedBy: !isAvail ? document.getElementById('m_borrower_id').value : null
    };

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 201) {
                closeModal();
                getAllBooks();
            } else {
                alert("Error: " + JSON.parse(xhr.responseText).message);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

function deleteBook(id) {
    if (!confirm("Delete this book?")) return;
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${API_URL}/books/${id}`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onreadystatechange = function() { if (xhr.readyState === 4) getAllBooks(); };
    xhr.send();
}

function updateStats(books, users) {
    if (books) {
        document.getElementById('totalBooks').textContent = books.length;
        document.getElementById('totalBorrowed').textContent = books.filter(b => !b.isAvailable).length;
    }
    if (users) document.getElementById('totalUsers').textContent = users.length;
}

function logout() { localStorage.clear(); window.location.href = "login.html"; }

window.onload = () => {
    getAllBooks();
    getAllUsers(); 
};