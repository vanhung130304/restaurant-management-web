import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js';
import { getFirestore, doc, setDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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
const analytics = getAnalytics(app);
const db = getFirestore(app)

async function fetchOrderHistory() {
    try {
        // Reference to the orders collection
        const ordersRef = collection(db, "orders");
        const querySnapshot = await getDocs(ordersRef);

        // Get order data
        const orderHistory = querySnapshot.docs.map(doc => doc.data());

        // Call function to display data in HTML
        displayOrderHistory(orderHistory);
    } catch (error) {
        console.error("Error fetching order history:", error);
    }
}

// Function to display order history in the table
function displayOrderHistory(orderHistory) {
    const orderTableBody = document.getElementById('orderTableBody');
    orderTableBody.innerHTML = '';  // Clear the table before adding new data

    orderHistory.forEach(order => {
        const row = document.createElement('tr');

        // Insert each order detail into a table row
        row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.food_name}</td>
        <td>${order.quantity}</td>
        <td>${order.price} VND</td>
        <td>${order.final_price}</td>
        <td>${order.discount_code_input} ${order.discount_code_select}</td>
        <td>${order.address}</td>
    `;

        orderTableBody.appendChild(row);  // Add the row to the table body
    });
}

function parsePrice(priceString) {
    return Number(priceString.replace(/[^0-9]+/g, "")); // Remove "₫" and "." and return number
}

// Fetch orders and calculate total revenue
async function calculateTotalRevenue() {
    try {
        // Reference to the orders collection
        const ordersRef = collection(db, "orders");
        const querySnapshot = await getDocs(ordersRef);

        // Initialize a variable to store total revenue
        let totalRevenue = 0;

        // Iterate over each order
        querySnapshot.forEach(doc => {
            const order = doc.data();
            const finalPrice = parsePrice(order.final_price);
            totalRevenue += finalPrice;  // Add the final price to the total revenue
        });

        // Display the total revenue
        displayTotalRevenue(totalRevenue);
    } catch (error) {
        console.error("Error calculating total revenue:", error);
    }
}

// Function to display total revenue in the HTML
function displayTotalRevenue(totalRevenue) {
    const revenueElement = document.getElementById('totalRevenue');
    revenueElement.textContent = `${totalRevenue.toLocaleString('vi-VN')} VND`;  // Format the total revenue
}

// Fetch and display order history when the page loads
window.addEventListener('DOMContentLoaded', fetchOrderHistory);
window.addEventListener('DOMContentLoaded', calculateTotalRevenue);