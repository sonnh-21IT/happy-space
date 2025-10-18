import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { validateCardData, generateWishingCode } from '../utils/validation';
import { apiService } from '../services/api';
import CardPreview from './CardPreview';
import FormField from './FormField';
import Button from './Button';
import Modal from './Modal';
import Confetti from './Confetti';
import FloatingHearts from './FloatingHearts';
import FloatingSnow from './FloatingSnow';
import Fireworks from './Fireworks';
import FloatingStars from './FloatingStars';
import FloatingBubbles from './FloatingBubbles';

export default function CreateCardForm() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    wishing: '',
    from_name: '',
    to_name: '',
    key: '',
    title: '',
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    theme_id: 'classic_theme',
    template_id: 'classic_template',
    effect: 'none' // Default effect
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showPreviewEffect, setShowPreviewEffect] = useState(false);

  const handleInputChange = (field, value) => {
    // Special handling for date field
    if (field === 'date') {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // If selected date is in the past, reset to current date
      if (selectedDate < currentDate) {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          [field]: today
        }));
        
        // Show notification as error message
        setErrors(prev => ({
          ...prev,
          [field]: 'Ngày đã chọn trong quá khứ. Đã tự động chuyển về ngày hiện tại.'
        }));
        
        // Clear the error after 3 seconds
        setTimeout(() => {
          setErrors(prev => ({
            ...prev,
            [field]: null
          }));
        }, 3000);
        
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Show preview effect when effect is changed
    if (field === 'effect') {
      if (value === 'none') {
        setShowPreviewEffect(false);
      } else {
        setShowPreviewEffect(true);
      }
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Check step completion whenever formData changes
  useEffect(() => {
    checkStepCompletion();
  }, [formData]);

  // Show preview effect on mount if effect is not 'none'
  useEffect(() => {
    if (formData.effect !== 'none') {
      setShowPreviewEffect(true);
    } else {
      setShowPreviewEffect(false);
    }
  }, []);

  const checkStepCompletion = (data = formData) => {
    const newCompletedSteps = {};
    
    // Step 1: Thông tin cơ bản
    if (data.from_name.trim() && data.to_name.trim() && data.key.trim() && data.key.length >= 4) {
      newCompletedSteps[1] = true;
    }
    
    // Step 2: Nội dung thiệp
    if (data.wishing.trim()) {
      newCompletedSteps[2] = true;
    }
    
    // Step 3: Thiết kế
    if (data.theme_id && data.template_id) {
      newCompletedSteps[3] = true;
    }
    
    setCompletedSteps(newCompletedSteps);
  };

  const isAllStepsCompleted = () => {
    return completedSteps[1] && completedSteps[2] && completedSteps[3];
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
      console.log('Đã copy link vào clipboard!');
    } catch (err) {
      console.log('Không thể copy link. Vui lòng copy thủ công.');
    }
  };

  const handleViewCard = () => {
    window.open(shareUrl, '_blank');
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setShareUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateCardData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Generate unique wishing code
      const wishingCode = generateWishingCode();
      
      // Prepare data for API - ensure all required fields are included
      const cardData = {
        wishing_code: wishingCode,
        from_name: formData.from_name,
        to_name: formData.to_name,
        holiday_title: formData.title,
        holiday_date: formData.date,
        wishing: formData.wishing,
        theme_id: formData.theme_id,
        template_id: formData.template_id,
        key: formData.key,
        effect: formData.effect,
        created_at: new Date().toISOString()
      };

      // Save to backend
      const result = await apiService.saveCard(cardData);
      
      if (result.success) {
        // Create share URL
        const shareUrl = `${window.location.origin}?wishing_code=${wishingCode}`;
        setShareUrl(shareUrl);
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
          wishing: '',
          from_name: '',
          to_name: '',
          key: '',
          title: '',
          date: new Date().toISOString().split('T')[0],
          theme_id: 'classic_theme',
          template_id: 'classic_template'
        });
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra khi lưu thiệp');
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Có lỗi xảy ra khi lưu thiệp' 
      });
    } finally {
      setIsSubmitting(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div className="tab-content">
            <FormField
              label="Tên người gửi"
              type="text"
              value={formData.from_name}
              onChange={(value) => handleInputChange('from_name', value)}
              error={errors.from_name}
              placeholder="Tên của bạn"
              required
            />
            
            <FormField
              label="Tên người nhận"
              type="text"
              value={formData.to_name}
              onChange={(value) => handleInputChange('to_name', value)}
              error={errors.to_name}
              placeholder="Tên người nhận thiệp"
              required
            />
            
            <FormField
              label="Mã bí mật"
              type="text"
              value={formData.key}
              onChange={(value) => handleInputChange('key', value)}
              error={errors.key}
              placeholder="Nhập mã bí mật để xem thiệp"
              required
            />
          </div>
        );
      
      case 2:
        return (
          <div className="tab-content">
            <FormField
              label="Tiêu đề thiệp"
              type="text"
              value={formData.title}
              onChange={(value) => handleInputChange('title', value)}
              error={errors.title}
              placeholder="Ví dụ: Chúc mừng sinh nhật, Chúc mừng ngày 8/3..."
            />
            
            <FormField
              label="Ngày"
              type="date"
              value={formData.date}
              onChange={(value) => handleInputChange('date', value)}
              error={errors.date}
              min={new Date().toISOString().split('T')[0]}
            />
            
            <FormField
              label="Lời chúc"
              type="textarea"
              value={formData.wishing}
              onChange={(value) => handleInputChange('wishing', value)}
              error={errors.wishing}
              placeholder="Nhập lời chúc của bạn..."
              required
            />
          </div>
        );
      
      case 3:
        return (
          <div className="tab-content">
            <FormField
              label="Chủ đề"
              type="select"
              value={formData.theme_id}
              onChange={(value) => handleInputChange('theme_id', value)}
              options={[
                { value: 'classic_theme', label: 'Cổ điển' },
                { value: 'modern_theme', label: 'Hiện đại' },
                { value: 'romantic_theme', label: 'Lãng mạn' },
                { value: 'previous_theme', label: 'Trước' },
                { value: 'ocean_theme', label: 'Đại dương' },
                { value: 'forest_theme', label: 'Rừng xanh' },
                { value: 'sunset_theme', label: 'Hoàng hôn' },
                { value: 'lavender_theme', label: 'Oải hương' },
                { value: 'golden_theme', label: 'Vàng kim' },
                { value: 'midnight_theme', label: 'Nửa đêm' }
              ]}
            />
            
              <FormField
                label="Mẫu thiệp"
                type="select"
                value={formData.template_id}
                onChange={(value) => handleInputChange('template_id', value)}
                options={[
                  { value: 'classic_template', label: 'Mẫu Cổ điển' },
                  { value: 'modern_template', label: 'Mẫu Hiện đại' },
                  { value: 'romantic_template', label: 'Mẫu Lãng mạn' }
                ]}
              />
              
              <FormField
                label="Hiệu ứng"
                type="select"
                value={formData.effect}
                onChange={(value) => handleInputChange('effect', value)}
                options={[
                  { value: 'confetti', label: '🎊 Confetti' },
                  { value: 'hearts', label: '❤️ Trái tim' },
                  { value: 'snow', label: '❄️ Tuyết rơi' },
                  { value: 'fireworks', label: '🎆 Pháo hoa' },
                  { value: 'stars', label: '⭐ Ngôi sao' },
                  { value: 'bubbles', label: '🫧 Bong bóng' },
                  { value: 'none', label: '⭕ Không có' }
                ]}
              />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="create-card-form">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form create-card-form-fullscreen">
          {/* Header - Fixed at top */}
          <div className="form-header">
            <h2>Tạo thiệp chúc mừng</h2>
            
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button
                type="button"
                className={`tab-button ${activeTab === 1 ? 'active' : ''} ${completedSteps[1] ? 'completed' : ''}`}
                onClick={() => setActiveTab(1)}
              >
                <span className="tab-number">
                  {completedSteps[1] ? '✓' : '1'}
                </span>
                <span className="tab-label">Thông tin cơ bản</span>
              </button>
              
              <button
                type="button"
                className={`tab-button ${activeTab === 2 ? 'active' : ''} ${completedSteps[2] ? 'completed' : ''}`}
                onClick={() => setActiveTab(2)}
              >
                <span className="tab-number">
                  {completedSteps[2] ? '✓' : '2'}
                </span>
                <span className="tab-label">Nội dung thiệp</span>
              </button>
              
              <button
                type="button"
                className={`tab-button ${activeTab === 3 ? 'active' : ''} ${completedSteps[3] ? 'completed' : ''}`}
                onClick={() => setActiveTab(3)}
              >
                <span className="tab-number">
                  {completedSteps[3] ? '✓' : '3'}
                </span>
                <span className="tab-label">Thiết kế</span>
              </button>
            </div>
          </div>
          
          {/* Scrollable content */}
          <div className="form-grid">
            {renderTabContent()}
          </div>
          
          {/* Footer - Fixed at bottom */}
          <div className="form-footer">
            <Button 
              type="submit" 
              disabled={isSubmitting || !isAllStepsCompleted()}
              className="submit-button"
            >
              {isSubmitting ? 'Đang tạo thiệp...' : 'Tạo thiệp'}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="preview-container">
        <CardPreview 
          data={formData}
          themeId={formData.theme_id}
          templateId={formData.template_id}
        />
        
        {/* Preview effects based on selected effect */}
        {showPreviewEffect && formData.effect === 'confetti' && <Confetti isActive={true} />}
        {showPreviewEffect && formData.effect === 'hearts' && <FloatingHearts isActive={true} />}
        {showPreviewEffect && formData.effect === 'snow' && <FloatingSnow isActive={true} />}
        {showPreviewEffect && formData.effect === 'fireworks' && <Fireworks isActive={true} />}
        {showPreviewEffect && formData.effect === 'stars' && <FloatingStars isActive={true} />}
        {showPreviewEffect && formData.effect === 'bubbles' && <FloatingBubbles isActive={true} />}
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleCloseModal}
        title="🎉 Thiệp Đã Được Tạo Thành Công!"
      >
        <div className="modal-success-icon">
          ✓
        </div>
        <div className="modal-message">
          Thiệp chúc mừng của bạn đã được tạo thành công! 
          Bạn có thể chia sẻ link này với người nhận.
        </div>
        <div className="modal-url">
          {shareUrl}
        </div>
        <div className="modal-actions">
          <button 
            className="modal-button modal-button-secondary"
            onClick={handleCopyUrl}
          >
            📋 Copy Link
          </button>
          <button 
            className="modal-button modal-button-primary"
            onClick={handleViewCard}
          >
            👁️ Xem Thiệp
          </button>
        </div>
      </Modal>
    </div>
  );
}
