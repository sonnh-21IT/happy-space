SECRET_KEY = "dcce11e001864b07bade5343a64e8e29"; 

post: WEB_APP_URL?key=dcce11e001864b07bade5343a64e8e29
get: WEB_APP_URL?key=dcce11e001864b07bade5343a64e8e29
filter: WEB_APP_URL?key=dcce11e001864b07bade5343a64e8e29&query=SELECT...

const WEB_APP_URL = "YOUR_DEPLOYED_WEB_APP_URL"; 
const SECRET_KEY = "dcce11e001864b07bade5343a64e8e29"; 

// --- 1. POST (Thêm Dữ liệu) ---
const postData = async (dataPayload) => {
    // Thêm key vào URL
    const url = `${WEB_APP_URL}?key=${SECRET_KEY}`; 
    
    try {
        const response = await axios.post(url, { data: dataPayload });
        return response.data;
    } catch (error) {
        console.error("POST failed:", error);
    }
};

// --- 2. GET (Lọc Mạnh mẽ) ---
const getFilteredData = async (gqlQuery) => {
    const encodedQuery = encodeURIComponent(gqlQuery);
    
    // Thêm key và query vào URL
    const url = `${WEB_APP_URL}?key=${SECRET_KEY}&query=${encodedQuery}`;
    
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("GET failed:", error);
    }
};

// Ví dụ sử dụng: Lấy bản ghi mới nhất có Tên là 'ProductX'
getFilteredData("SELECT * WHERE B = 'ProductX' ORDER BY A DESC LIMIT 1");