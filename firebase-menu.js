import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, addDoc, doc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDfgWRy7bLoMaoH-4XEd6RRjVADeSUG8sY",
    authDomain: "nethue-ktpm.firebaseapp.com",
    projectId: "nethue-ktpm",
    storageBucket: "nethue-ktpm.appspot.com",
    messagingSenderId: "923818382455",
    appId: "1:923818382455:web:a7583381f3c3b211e66272",
    measurementId: "G-G81N2NNXDF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentProductName;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addbtn').addEventListener('click', addProduct);
    document.getElementById('productTable').addEventListener('click', handleTableActions);
    document.getElementById('updateProductBtn').addEventListener('click', updateProduct);
}

function handleTableActions(event) {
    if (event.target.classList.contains('edit-btn')) {
        showEditProductModal(event.target);
    } else if (event.target.classList.contains('delete-btn')) {
        deleteProduct(event.target);
    }
}

async function addProduct() {
    const name = document.getElementById('addProductName').value;
    const price = parseInt(document.getElementById('addProductPrice').value);
    const imglink = "";
    
    if (!name || isNaN(price)) {
        alert("Vui lòng nhập thông tin hợp lệ!");
        return;
    }
    
    try {
        const productRef = collection(db, "foods");
        await addDoc(productRef, { name, price, imglink });
        
        alert('Sản phẩm đã được thêm!');
        fetchProducts();
        closeAddProductModal();
    } catch (error) {
        console.error("Error adding product:", error);
        alert('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.');
    }
}

async function fetchProducts() {
    try {
        const productRef = collection(db, "foods");
        const productSnapshot = await getDocs(productRef);
        const productList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        displayProducts(productList);
    } catch (error) {
        console.error("Error fetching products:", error);
        alert('Có lỗi xảy ra khi tải danh sách sản phẩm. Vui lòng thử lại.');
    }
}

function displayProducts(productList) {
    const tbody = document.querySelector('#productTable tbody');
    tbody.innerHTML = "";

    productList.forEach(product => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', product.id);
        row.setAttribute('data-name', product.name);

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${formatPrice(product.price)}</td>
            <td>
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VND';
}

function showEditProductModal(button) {
    const row = button.closest('tr');
    const productName = row.querySelector('td:nth-child(1)').textContent;
    const productPrice = row.querySelector('td:nth-child(2)').textContent.replace(' VND', '').replace(/,/g, '');

    // Check if the modal elements exist
    const nameInput = document.getElementById('editProductName');
    const priceInput = document.getElementById('editProductPrice');

    if (!nameInput || !priceInput) {
        console.error("Edit modal elements not found!");
        return;
    }

    nameInput.value = productName;
    priceInput.value = productPrice;

    currentProductName = row.getAttribute('data-name');

    document.getElementById('editProductModal').style.display = 'flex';
}


function closeEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

async function updateProduct() {
    const newName = document.getElementById('editProductName').value;
    const newPrice = parseInt(document.getElementById('editProductPrice').value);

    if (!newName || isNaN(newPrice)) {
        alert("Vui lòng nhập thông tin hợp lệ!");
        return;
    }

    try {
        const productRef = collection(db, "foods");
        const productSnapshot = await getDocs(productRef);
        const productDoc = productSnapshot.docs.find(doc => doc.data().name === currentProductName);

        if (productDoc) {
            await updateDoc(productDoc.ref, { name: newName, price: newPrice });
            alert('Sản phẩm đã được cập nhật!');
            closeEditProductModal();
            fetchProducts();
        } else {
            console.error("Product not found!");
            alert('Không tìm thấy sản phẩm. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error("Error updating product:", error);
        alert('Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.');
    }
}

async function deleteProduct(button) {
    const row = button.closest('tr');
    const productId = row.getAttribute('data-id');
    const productName = row.getAttribute('data-name');

    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
        try {
            const productRef = collection(db, "foods");
            const productDoc = await deleteDoc(doc(productRef, productId));

            alert('Sản phẩm đã được xóa!');
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.');
        }
    }
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
    document.getElementById('addProductName').value = '';
    document.getElementById('addProductPrice').value = '';
}

// You might want to add these functions if they're not already present in your HTML
function showAddProductModal() {
    document.getElementById('addProductModal').style.display = 'flex';
}

function showSection(sectionId) {
    const sections = ['products', 'orders', 'revenue', 'reservations'];
    sections.forEach(id => {
        document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
    });
}