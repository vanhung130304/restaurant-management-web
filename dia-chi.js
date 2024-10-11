// Khởi tạo bản đồ
const map = L.map('map').setView([16.047079, 108.206230], 15); // Tọa độ trung tâm Đà Nẵng

// Thêm lớp bản đồ từ OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Hàm tìm nhà hàng gần nhất
async function findNearestRestaurant() {
    const restaurantCoords = [
        { name: 'Nét Huế', lat: 16.049, lng: 108.206 }, // Thay bằng tọa độ thực tế
    ];

    // Xóa tất cả các marker hiện có
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Thêm marker cho nhà hàng
    restaurantCoords.forEach(restaurant => {
        L.marker([restaurant.lat, restaurant.lng])
            .addTo(map)
            .bindPopup(restaurant.name);
    });

    // Đặt bản đồ đến nhà hàng gần nhất
    map.setView([restaurantCoords[0].lat, restaurantCoords[0].lng], 15);
}

// Gán sự kiện cho nút
document.getElementById('findRestaurant').addEventListener('click', findNearestRestaurant);
