# Hướng dẫn Setup Dự án Thiệp Chúc Mừng

## 🚀 Cài đặt và Chạy Dự án

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Environment Variables
Tạo file `.env` trong thư mục gốc:
```env
REACT_APP_SECRET_KEY=your_gas_api_key_here
```

### 3. Chạy Development Server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 🏗️ Cấu trúc Dự án

```
src/
├── components/           # React Components
│   ├── Router.jsx       # Logic routing chính
│   ├── CreateCardForm.jsx    # Form tạo thiệp
│   ├── KeyInputForm.jsx      # Form nhập mật khẩu
│   ├── FinalCardDisplay.jsx  # Hiển thị thiệp cuối
│   ├── CardPreview.jsx       # Xem trước thiệp
│   ├── FormField.jsx         # Component input tái sử dụng
│   ├── Button.jsx            # Component button tái sử dụng
│   └── LoadingSpinner.jsx    # Loading indicator
├── context/
│   └── AppContext.jsx        # Global state management
├── hooks/
│   └── useURLParams.js       # Hook đọc URL parameters
├── services/
│   └── api.js               # API service cho GAS
├── utils/
│   ├── validation.js        # Validation functions
│   └── themeUtils.js         # Theme và template utilities
├── App.jsx                  # Root component
└── main.jsx                 # Entry point
```

## 🔧 Cấu hình Backend (Google Apps Script)

### 1. Tạo Google Apps Script Project
1. Truy cập [script.google.com](https://script.google.com)
2. Tạo project mới
3. Thêm code sau vào `Code.gs`:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Lưu vào Google Sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    const row = [
      data.wishing_code,    // Column A
      data.key,             // Column B  
      data.wishing,         // Column C
      data.from_name,       // Column D
      data.theme_id,        // Column E
      data.template_id,     // Column F
      data.created_at       // Column G
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const query = e.parameter.query;
    
    // Thực hiện GQL query trên Google Sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Parse GQL query và filter data
    // Implementation chi tiết tùy thuộc vào cấu trúc GQL
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, data: result}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2. Deploy GAS API
1. Click "Deploy" > "New deployment"
2. Chọn "Web app"
3. Set permissions: "Anyone"
4. Copy URL và cập nhật `REACT_APP_SECRET_KEY`

## 🌐 Cấu hình Proxy

### Development (Vite)
File `vite.config.js` đã được cấu hình sẵn:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://script.google.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      secure: true,
      followRedirects: true,
    }
  }
}
```

### Production (Netlify)
Tạo file `_redirects` trong thư mục `public/`:
```
/api/* https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec 200!
```

## 🎨 Customization

### Thêm Theme Mới
1. Cập nhật `themeUtils.js`:
```javascript
export const getThemeClasses = (themeId) => {
  const themes = {
    theme1: 'theme-classic',
    theme2: 'theme-modern',
    theme3: 'theme-romantic',
    theme4: 'theme-custom'  // Theme mới
  };
  return themes[themeId] || themes.theme1;
};
```

2. Thêm CSS cho theme mới trong `main.css`

### Thêm Template Mới
Cập nhật `getTemplateStructure` trong `themeUtils.js`:
```javascript
template4: {
  html: `
    <div class="template-4">
      <!-- HTML structure của template mới -->
    </div>
  `
}
```

## 🚀 Deploy

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `REACT_APP_SECRET_KEY`

### GitHub Pages
1. Cài đặt `gh-pages`: `npm install --save-dev gh-pages`
2. Thêm script vào `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
3. Chạy: `npm run deploy`

## 🔍 Testing

### Test Local
1. Chạy `npm run dev`
2. Test tạo thiệp: Không có `wishing_code` trong URL
3. Test xem thiệp: Thêm `?wishing_code=test123` vào URL

### Test API
```bash
# Test POST
curl -X POST http://localhost:5173/api \
  -H "Content-Type: application/json" \
  -d '{"wishing_code":"test","key":"1234","wishing":"Hello"}'

# Test GET  
curl "http://localhost:5173/api?query=SELECT%20*%20WHERE%20B%20=%20%27test%27"
```

## 🐛 Troubleshooting

### Lỗi CORS
- Đảm bảo GAS API được deploy với quyền "Anyone"
- Kiểm tra proxy configuration

### Lỗi API
- Kiểm tra `REACT_APP_SECRET_KEY` trong `.env`
- Verify GAS script URL và permissions

### Lỗi Build
- Chạy `npm run lint` để kiểm tra code
- Đảm bảo tất cả imports đúng path
