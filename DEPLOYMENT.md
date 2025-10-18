# 🚀 Hướng dẫn Triển khai (Deployment Guide)

## Tổng quan Kiến trúc

Dự án này sử dụng kiến trúc kết hợp:
- **GitHub Pages**: Host frontend tĩnh (HTML, CSS, JS)
- **Netlify**: Làm proxy để giao tiếp với Google Apps Script (GAS) API

## 📋 Các bước chuẩn bị

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Repository Name

Mở file `vite.config.js` và sửa dòng:

```javascript
base: '/happy-space/', // Đổi 'happy-space' thành tên repo GitHub của bạn
```

Ví dụ: Nếu repo của bạn là `my-card-app`, thì đổi thành:

```javascript
base: '/my-card-app/',
```

## 🔧 Triển khai lên GitHub Pages

### Phương án 1: Sử dụng GitHub Actions (Khuyến nghị) ⭐

File GitHub Actions workflow đã được tạo sẵn tại `.github/workflows/deploy.yml`.

**Các bước thực hiện:**

1. **Đẩy code lên GitHub:**
   ```bash
   git add .
   git commit -m "Setup deployment configuration"
   git push origin main
   ```

2. **Kích hoạt GitHub Pages trong Settings:**
   - Vào repo của bạn trên GitHub
   - Chọn **Settings** > **Pages**
   - Trong **Source**, chọn **GitHub Actions**
   - Workflow sẽ tự động chạy mỗi khi bạn push code lên branch `main`

3. **Xem kết quả:**
   - Vào tab **Actions** để xem tiến trình deploy
   - Sau khi deploy xong, truy cập: `https://[username].github.io/[repo-name]/`

### Phương án 2: Deploy thủ công với gh-pages

```bash
# Cài đặt gh-pages (nếu chưa có)
npm install

# Deploy
npm run deploy
```

File sẽ được deploy lên branch `gh-pages` tự động.

**Cấu hình GitHub Pages:**
- Vào repo của bạn trên GitHub
- Chọn **Settings** > **Pages**
- Trong **Source**, chọn branch **gh-pages** và folder **/ (root)**
- Save

## 🌐 Triển khai lên Netlify (Làm Proxy)

### Tại sao cần Netlify?

GitHub Pages **không hỗ trợ serverless functions**, nên chúng ta cần Netlify để:
- Che giấu URL Google Apps Script
- Xử lý CORS
- Làm proxy API từ frontend đến GAS

### Các bước triển khai:

1. **Đăng ký/Đăng nhập Netlify:**
   - Truy cập [netlify.com](https://www.netlify.com)
   - Đăng nhập bằng GitHub account

2. **Import Repository:**
   - Click **"Add new site"** > **"Import an existing project"**
   - Chọn **GitHub** và authorize Netlify
   - Chọn repository `happy-space` (hoặc tên repo của bạn)

3. **Cấu hình Build Settings:**
   
   Netlify sẽ tự động đọc file `netlify.toml`, nhưng bạn cũng có thể kiểm tra:
   
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `src/netlify/functions`

4. **Deploy:**
   - Click **"Deploy site"**
   - Đợi vài phút để Netlify build và deploy
   - Bạn sẽ nhận được URL dạng: `https://random-name.netlify.app`

5. **Đổi tên domain (Tùy chọn):**
   - Vào **Site settings** > **Domain management**
   - Click **"Change site name"**
   - Đổi thành tên dễ nhớ, ví dụ: `my-happy-space`
   - URL mới: `https://my-happy-space.netlify.app`

## 🔗 Cấu hình kết nối Frontend - Backend

### Môi trường Development (Local)

Khi chạy `npm run dev`:
- Frontend chạy tại: `http://localhost:5173`
- Proxy được xử lý bởi **Vite Dev Server** (cấu hình trong `vite.config.js`)
- API calls từ React: `fetch('/api?key=...')`
- Vite tự động proxy đến Google Apps Script

### Môi trường Production

Có 2 luồng:

#### 1. **GitHub Pages (Frontend tĩnh)**
- URL: `https://[username].github.io/[repo-name]/`
- Chỉ host HTML, CSS, JS tĩnh
- **KHÔNG** xử lý API calls trực tiếp

#### 2. **Netlify (Proxy API)**
- URL: `https://[site-name].netlify.app`
- Host cả frontend VÀ serverless function proxy
- API calls: `https://[site-name].netlify.app/api` → proxy đến GAS

### Cách sử dụng kết hợp

Có 2 cách sử dụng:

**Cách 1: Dùng riêng Netlify (Đơn giản nhất) ⭐**
- Deploy lên Netlify
- Truy cập: `https://[site-name].netlify.app`
- Netlify xử lý cả frontend và proxy API

**Cách 2: Dùng GitHub Pages + Netlify làm API proxy (Phức tạp hơn)**

Nếu bạn muốn host frontend trên GitHub Pages nhưng dùng Netlify làm proxy:

1. Cập nhật API base URL trong code React:

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://[site-name].netlify.app/api'  // Thay bằng Netlify URL
  : '/api';
```

2. Sau đó, tất cả API calls sẽ đi qua Netlify:
```javascript
fetch(`${API_BASE_URL}?key=...`)
```

## 📝 Checklist Triển khai

### Trước khi deploy:

- [ ] Đã sửa `base` path trong `vite.config.js` đúng với tên repo
- [ ] Đã test trên local: `npm run dev`
- [ ] Đã commit tất cả thay đổi

### GitHub Pages:

- [ ] Đã push code lên GitHub
- [ ] Đã kích hoạt GitHub Pages trong Settings
- [ ] Đã chọn source là GitHub Actions hoặc gh-pages branch
- [ ] Đã kiểm tra Actions tab (nếu dùng GitHub Actions)

### Netlify:

- [ ] Đã import repository vào Netlify
- [ ] Build thành công (xem Deploy log)
- [ ] Functions được deploy (xem Functions tab)
- [ ] Đã test API proxy: `https://[site-name].netlify.app/api?key=...`

### Kiểm tra cuối cùng:

- [ ] Truy cập URL production
- [ ] Test tạo thiệp mới
- [ ] Test nhập mã thiệp và xem thiệp
- [ ] Kiểm tra API có hoạt động (mở DevTools Network tab)

## 🐛 Troubleshooting

### Lỗi 404 trên GitHub Pages

**Nguyên nhân**: Base path không đúng

**Giải pháp**:
- Kiểm tra `base` trong `vite.config.js` phải khớp với tên repo
- Rebuild và deploy lại

### Netlify Functions không hoạt động

**Nguyên nhân**: Functions directory sai hoặc code lỗi

**Giải pháp**:
- Vào Netlify Dashboard > Functions tab
- Kiểm tra functions có được deploy không
- Xem logs để debug

### CORS Error

**Nguyên nhân**: API call không đi qua proxy

**Giải pháp**:
- Đảm bảo API calls dùng `/api` path (hoặc full Netlify URL)
- Kiểm tra `netlify.toml` có redirect đúng
- Xem Network tab trong DevTools

### API trả về lỗi từ Google Apps Script

**Nguyên nhân**: GAS API chưa được deploy đúng

**Giải pháp**:
- Kiểm tra GAS API URL trong `proxy.js`
- Đảm bảo GAS được deploy với quyền "Anyone"
- Test GAS API trực tiếp bằng Postman/curl

## 📚 Tài liệu tham khảo

- [Vite - Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Google Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)

## 🎯 Khuyến nghị

Để đơn giản hóa, tôi khuyên bạn:

1. **Chỉ dùng Netlify** cho cả frontend và proxy (1 nơi duy nhất)
2. **GitHub Pages** chỉ dùng như backup hoặc demo
3. Khi cần scale lên, có thể dùng custom domain và Cloudflare

Happy deploying! 🚀

