import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

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

document.getElementById('submitBtn').addEventListener('click', async function () {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const people = document.getElementById('people').value;

    if (name && email && phone && date && time && people) {
        try {
            await addDoc(collection(db, "reservations"), {
                name: name,
                email: email,
                phone: phone,
                reservationDate: date,
                reservationTime: time,
                numberOfPeople: people,
            });

            const resultMessage = document.getElementById('resultMessage');
            resultMessage.style.display = 'block';
            resultMessage.innerHTML = `Cảm ơn bạn ${name}! Bạn đã đặt bàn thành công vào lúc ${time} ngày ${date} cho ${people} người. Chúng tôi sẽ liên hệ với bạn qua số điện thoại ${phone} hoặc email ${email}.`;

            document.getElementById('reservationForm').reset();
        } catch (error) {
            console.error("Error saving reservation:", error);
            alert("Có lỗi xảy ra khi đặt bàn, vui lòng thử lại.");
        }
    } else {
        alert("Vui lòng điền đầy đủ thông tin!");
    }
});
