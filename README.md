
## 1\. Tổng quan Kiến trúc và Công nghệ 🌐

Ứng dụng Thiệp Chúc Mừng của bạn được xây dựng theo mô hình **JAMstack** hiện đại, đảm bảo tốc độ và khả năng mở rộng.

### Các hiệu ứng có sẵn:
- 🎊 **Confetti**: Hiệu ứng rải confetti nhiều màu sắc
- ❤️ **Hearts (Trái tim)**: Hiệu ứng trái tim bay lơ lửng  
- ❄️ **Snow (Tuyết rơi)**: Hiệu ứng tuyết rơi lãng mạn
- 🎆 **Fireworks (Pháo hoa)**: Hiệu ứng pháo hoa nổ rực rỡ
- ⭐ **Stars (Ngôi sao)**: Hiệu ứng ngôi sao bay lên lấp lánh
- 🫧 **Bubbles (Bong bóng)**: Hiệu ứng bong bóng xuất hiện ngẫu nhiên, phóng to rồi mờ dần

| Thành phần | Công nghệ/Dịch vụ | Vai trò |
| :--- | :--- | :--- |
| **Frontend/UI** | **ReactJS (Vite)** | Xây dựng 3 Trạng thái UI chính và Logic Client-side (Themes/Templates). |
| **Hosting** | **GitHub Pages** | Lưu trữ code tĩnh (HTML/CSS/JS) của Frontend. |
| **Backend/Database** | **Google Apps Script (GAS) & Google Sheet** | Cung cấp API để **Lưu trữ (POST)** và **Truy vấn/Xác thực (GET)** dữ liệu thiệp. |
| **Giao tiếp API** | **Vite Proxy (Dev) & Netlify Proxy (Prod)** | Bảo mật **URL GAS** và **xử lý CORS** bằng cách chuyển tiếp yêu cầu từ `/api` đến GAS API. |
| **Mã Định Danh** | **`wishing_code`** | Mã duy nhất để truy vấn thiệp (`?wishing_code=...`). |

-----

## 2\. Luồng Ứng Dụng Hoạt động (Application Flow) 🚀

Luồng ứng dụng ReactJS được điều khiển bởi logic định tuyến dựa trên việc kiểm tra tham số URL `wishing_code`.

### ⚙️ Trạng thái A: Màn hình Tạo Thiệp (Create View)

**Điều kiện kích hoạt:** URL **KHÔNG** chứa tham số `wishing_code`.

| Bước | Hoạt động | Thành phần Xử lý | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- |
| **1. Khởi động** | Hiển thị Form | **React Router/Component Logic** | Component `CreateCardForm` được hiển thị, bao gồm các trường nhập liệu (`wishing`, `key`, `theme_id`, v.v.). |
| **2. Xem trước (Preview)** | Cập nhật theo thời gian thực | **React State/Component Logic** | Mỗi lần người dùng thay đổi input, State được cập nhật. Component `CardPreview` nhận State mới, **Load `theme_id`** (áp dụng CSS) và **Load `template_id`** (render cấu trúc nội dung). |
| **3. Lưu Thiệp** | Kích hoạt POST Request | **React Handler** | Người tạo bấm nút. Frontend tạo một **`wishing_code`** duy nhất, gộp với toàn bộ dữ liệu form. |
| **4. Giao tiếp Backend** | Gọi GAS API `doPost` | **ReactJS → Proxy Netlify** | Gọi API: `POST /api?key=[SECRET_KEY]` với JSON Body chứa dữ liệu thiệp. |
| **5. Phản hồi & Chia sẻ** | Hoàn tất lưu trữ | **GAS & ReactJS** | GAS ghi dữ liệu vào Google Sheet, trả về `success: true`. React tạo URL chia sẻ: `yourpage.com/?wishing_code=[mã mới]`. |

-----

### 🔑 Trạng thái B: Màn hình Nhập KEY (Key Input View)

**Điều kiện kích hoạt:** URL **CÓ** `wishing_code`, nhưng dữ liệu thiệp **chưa được lấy**.

| Bước | Hoạt động | Thành phần Xử lý | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- |
| **1. Khởi động** | Hiển thị Nhập KEY | **React Component Logic** | Frontend đọc `wishing_code` từ URL, hiển thị Component `KeyInputForm`. |
| **2. Người nhận cung cấp** | Nhập Mật khẩu Thiệp | **React Component** | Người nhận nhập **Mật khẩu Thiệp** (`key`) vào ô input. |
| **3. Dựng Truy vấn GQL** | Xây dựng GQL Query | **ReactJS Frontend** | Frontend tạo câu lệnh GQL có dạng: $$\small \texttt{SELECT * WHERE wishing\_code='...' AND key='[Mật khẩu Nhập]'}$$ |
| **4. Giao tiếp Backend** | Gọi GAS API `doGet` | **ReactJS → Proxy Netlify** | Gửi yêu cầu: `GET /api?key=[SECRET\_KEY]\&query=[GQL Query đã mã hóa]`. |
| **5. Xác thực Kép** | Xử lý `doGet` | **GAS Backend** | **GAS** thực hiện truy vấn GQL. Nếu truy vấn trả về **1 hàng** (khớp cả `wishing_code` và `key`), xác thực thành công. |
| **6. Điều hướng** | Chuyển Trạng thái | **ReactJS** | Nếu thành công: React nhận dữ liệu thiệp, chuyển sang **Trạng thái C**. Nếu thất bại: React hiển thị lỗi "Mật khẩu không đúng." |

-----

### 🎁 Trạng thái C: Màn hình Hiển thị Thiệp (Recipient View)

**Điều kiện kích hoạt:** Dữ liệu thiệp đã được lấy thành công từ GAS.

| Bước | Hoạt động | Thành phần Xử lý | Mô tả Chi tiết |
| :--- | :--- | :--- | :--- |
| **1. Load Dữ liệu** | Lưu trữ dữ liệu | **React State/Context** | Dữ liệu thiệp nhận được từ GAS được lưu trữ trong State/Context của React. |
| **2. Render Cuối cùng** | Hiển thị Component | **React Component `FinalCardDisplay`** | Component này nhận dữ liệu đầy đủ. |
| **3. Áp dụng Giao diện** | Theme/Template Rendering | **React Component Logic** | Sử dụng `theme_id` để áp dụng Class CSS chính xác và `template_id` để chèn các trường dữ liệu (`wishing`, `from_name`, v.v.) vào cấu trúc JSX/HTML cuối cùng. |
| **4. Hoàn tất** | Hiển thị Thiệp | **Người dùng cuối** | Người nhận thấy thiệp cá nhân hóa đã được định dạng hoàn chỉnh. |

-----

## 3\. Hướng dẫn Kỹ thuật Cấu hình 🛠️

### A. Cấu hình Proxy Bắt buộc

| Môi trường | Công cụ Proxy | Cách gọi trong React | Cấu hình File |
| :--- | :--- | :--- | :--- |
| **Phát triển (Local)** | **Vite Dev Server** | `fetch('/api?query=...')` | **`vite.config.js`** (dùng `server.proxy`) |
| **Triển khai (Production)** | **Netlify Redirects** | `fetch('/api?query=...')` | **`_redirects`** (dùng rule `200!`) |

### B. Hướng dẫn Mức độ Bảo mật cho Key

1.  **`SECRET_KEY` (Khóa GAS API):**
      * **Tuyệt đối không** hardcode trong React code (dù đã biên dịch).
      * **NÊN** được lưu trữ dưới dạng **Environment Variable** trên **Netlify**. Netlify có thể tự động chèn Key này vào URL GAS khi thực hiện Redirect.
2.  **`key` (Mật khẩu Thiệp):**
      * Được người dùng nhập vào Form (Trạng thái B).
      * Được truyền qua **URL GQL** để GAS kiểm tra. Việc sử dụng Proxy Netlify giúp bảo vệ cuộc gọi này.

### C. GQL Query Format (Ví dụ)

Trong React, bạn phải đảm bảo câu truy vấn được xây dựng an toàn để tránh Injection và tìm chính xác một hàng duy nhất.

```javascript
// Giả sử WISHING_CODE_COL là B và ACCESS_KEY_COL là C trong Sheet của bạn
const userWCode = URL_PARAMS.get('wishing_code');
const userKey = document.getElementById('keyInput').value;

// Dùng Template Literals và escape (nếu cần)
const gqlQuery = `SELECT * WHERE B = '${userWCode}' AND C = '${userKey}' LIMIT 1`; 
```