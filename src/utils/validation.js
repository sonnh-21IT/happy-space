// Validation utilities
export const validateCardData = (data) => {
  const errors = {};
  
  if (!data.wishing || data.wishing.trim().length === 0) {
    errors.wishing = 'Lời chúc không được để trống';
  }
  
  if (!data.from_name || data.from_name.trim().length === 0) {
    errors.from_name = 'Tên người gửi không được để trống';
  }
  
  if (!data.to_name || data.to_name.trim().length === 0) {
    errors.to_name = 'Tên người nhận không được để trống';
  }
  
  if (!data.key || data.key.trim().length === 0) {
    errors.key = 'Mã bí mật không được để trống';
  }
  
  if (data.key && data.key.length < 4) {
    errors.key = 'Mã bí mật phải có ít nhất 4 ký tự';
  }
  
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Tiêu đề thiệp không được để trống';
  }
  
  if (!data.date || data.date.trim().length === 0) {
    errors.date = 'Ngày không được để trống';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateWishingCode = () => {
  return 'WC' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};
