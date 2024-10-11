import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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

async function fetchProducts() {
    try {
        const productRef = collection(db, "foods");
        const productSnapshot = await getDocs(productRef);
        const productList = productSnapshot.docs.map(doc => doc.data());

        displayProducts(productList);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to display product data in the table
function displayProducts(productList) {
    const tbody = document.querySelector('#productTable tbody');
    tbody.innerHTML = "";  // Clear the table before inserting new data

    productList.forEach(product => {
        const row = document.createElement('tr');

        // Insert product data into table row
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${formatPrice(product.price)}</td>
            <td>
                <button class="edit-btn" onclick="showEditProductModal(this)">Sửa</button>
                <button class="delete-btn" onclick="deleteProduct(this)">Xóa</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VND';
}

let currentProductId = '';  // This will store the ID of the product being edited

// Function to show the edit modal and populate fields with existing data
function showEditProductModal(button) {
    const row = button.closest('tr');
    const productName = row.querySelector('td:nth-child(1)').textContent;
    const productPrice = row.querySelector('td:nth-child(2)').textContent.replace(' VND', '').replace(',', '');  // Remove VND and comma

    // Set the input fields with current product data
    document.getElementById('editProductName').value = productName;
    document.getElementById('editProductPrice').value = productPrice;

    // Get the product ID (you may store it in a data attribute)
    currentProductId = row.getAttribute('data-id');  // Assuming data-id contains Firestore document ID

    // Show the modal
    document.getElementById('editProductModal').style.display = 'flex';
}

// Close the edit modal
function closeEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

// Update the product in Firestore
async function updateProduct() {
    const newName = document.getElementById('editProductName').value;
    const newPrice = parseInt(document.getElementById('editProductPrice').value);

    if (!newName || isNaN(newPrice)) {
        alert("Vui lòng nhập thông tin hợp lệ!");
        return;
    }

    try {
        const productRef = doc(db, "foods", currentProductId);  // Replace 'foods' with your collection
        await updateDoc(productRef, {
            name: newName,
            price: newPrice
        });

        alert('Sản phẩm đã được cập nhật!');
        closeEditProductModal();
        fetchFoods();  // Re-fetch the product list to reflect the updates
    } catch (error) {
        console.error("Error updating product:", error);
    }
}

// Delete the product from Firestore
async function deleteProduct(button) {
    const row = button.closest('tr');
    const productId = row.getAttribute('data-id');  // Get the document ID from a data attribute

    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
            const productRef = doc(db, "foods", productId);  // Replace 'foods' with your collection
            await deleteDoc(productRef);

            alert('Sản phẩm đã được xóa!');
            fetchFoods();  // Re-fetch the product list to reflect the deletion
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
}

window.addEventListener('DOMContentLoaded', fetchProducts);