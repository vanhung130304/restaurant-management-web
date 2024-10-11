import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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
const db = getFirestore(app)

async function fetchReservations() {
    try {
        const reservationRef = collection(db, "reservations");
        const reservationSnapshot = await getDocs(reservationRef);
        const reservationList = reservationSnapshot.docs.map(doc => doc.data());

        displayReservations(reservationList); 
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }
}

function displayReservations(reservationList) {
    const tbody = document.querySelector('#reservationTableBody');
    tbody.innerHTML = "";  

    reservationList.forEach(reservation => {
        const row = document.createElement('tr');

        const formattedDateTime = formatDateTime(reservation.reservationDate, reservation.reservationTime);

        row.innerHTML = `
            <td>${reservation.name}</td>
            <td>${reservation.numberOfPeople}</td>
            <td>${formattedDateTime}</td>
            <td>${reservation.phone}</td>
            <td>${reservation.email}</td>
        `;

        tbody.appendChild(row);
    });
}

function formatDateTime(dateString, timeString) {
    const [year, month, day] = dateString.split('-'); 
    const date = new Date(year, month - 1, day); 
    const formattedDate = date.toLocaleDateString('en-GB'); 
    return `${formattedDate} ${timeString}`;
}

window.addEventListener('DOMContentLoaded', () => {
    fetchReservations();
});