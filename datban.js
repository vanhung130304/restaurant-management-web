// Lắng nghe sự kiện click vào nút "Đặt Bàn"
document.getElementById('submitBtn').addEventListener('click', function () {
    // Lấy các giá trị từ form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const people = document.getElementById('people').value;

    // Kiểm tra nếu form hợp lệ
    if (name && email && phone && date && time && people) {
        // Hiển thị thông báo thành công
        const resultMessage = document.getElementById('resultMessage');
        resultMessage.style.display = 'block';
        resultMessage.innerHTML = `Cảm ơn bạn ${name}! Bạn đã đặt bàn thành công vào lúc ${time} ngày ${date} cho ${people} người. Chúng tôi sẽ liên hệ với bạn qua số điện thoại ${phone} hoặc email ${email}.`;

        // Reset form
        document.getElementById('reservationForm').reset();
    } else {
        // Nếu form không hợp lệ, báo lỗi
        alert("Vui lòng điền đầy đủ thông tin!");
    }
});
