# Vote for Fun

Đây là một ứng dụng web được xây dựng bằng Next.js cho phép người dùng tạo và tham gia bình chọn dựa trên menu của các nhà hàng trên Grab Food.

## Giới thiệu

Ứng dụng này cho phép người dùng nhập URL của một nhà hàng trên Grab Food để lấy menu và tạo cuộc bình chọn từ các món ăn có trong menu đó. Người dùng có thể chọn nhiều món ăn và tạo cuộc bình chọn để mọi người tham gia.

## Tính năng

- Lấy menu từ Grab Food thông qua URL.
- Tạo cuộc bình chọn từ các món ăn trong menu.
- Hiển thị kết quả bình chọn theo thời gian thực.

## Công nghệ sử dụng

- **Next.js**: Framework cho React để xây dựng ứng dụng web.
- **Axios**: Thư viện để thực hiện các yêu cầu HTTP.
- **Cheerio**: Thư viện để phân tích cú pháp HTML và lấy dữ liệu từ trang web.
- **SQLite**: Cơ sở dữ liệu nhẹ để lưu trữ thông tin bình chọn.
- **Pusher**: Dùng để gửi thông báo theo thời gian thực khi có thay đổi trong cuộc bình chọn.

## Cài đặt

1. **Clone repository**:

   ```bash
   git clone https://github.com/yourusername/vote-for-fun.git
   cd vote-for-fun
   ```

2. **Cài đặt các phụ thuộc**:

   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường**: Tạo một tệp `.env.local` trong thư mục gốc của dự án và thêm các biến môi trường cần thiết:

   ```plaintext
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_KEY=your_pusher_key
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=your_pusher_cluster
   ```

4. **Chạy ứng dụng**:

   ```bash
   npm run dev
   ```

   Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Sử dụng

1. Nhập URL của nhà hàng trên Grab Food vào ô nhập liệu.
2. Nhấn nút "Lấy Menu" để lấy danh sách món ăn.
3. Chọn các món ăn bạn muốn và nhấn nút "Tạo Bình Chọn".
4. Chia sẻ cuộc bình chọn với bạn bè để mọi người tham gia.

## Ghi chú

- Đảm bảo rằng URL bạn nhập là chính xác và có thể truy cập được.
- Ứng dụng này có thể không hoạt động nếu cấu trúc HTML của trang Grab Food thay đổi.

## Đóng góp

Nếu bạn muốn đóng góp cho dự án này, hãy tạo một pull request hoặc mở một issue để thảo luận về các thay đổi.

## Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE).