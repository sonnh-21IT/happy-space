import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useURLParams } from '../hooks/useURLParams';
import { apiService } from '../services/api';
import FormField from './FormField';
import Button from './Button';

export default function KeyInputForm() {
  const { dispatch, error } = useApp();
  const { wishingCode } = useURLParams();
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [isLoadingCard, setIsLoadingCard] = useState(!!wishingCode);

  // Load card data when component mounts
  useEffect(() => {
    const loadCardData = async () => {
      if (!wishingCode) {
        // Delay 1.5s before showing default state
        setTimeout(() => {
          setIsLoadingCard(false);
        }, 1500);
        return;
      }
      
      dispatch({ type: 'CLEAR_ERROR' });
      
      try {
        const result = await apiService.getCardByCode(wishingCode);
        
        // Check if result is an array (direct response from GAS)
        if (Array.isArray(result)) {
          if (result.length > 0) {
            setCardData(result[0]);
          } else {
            // No data found for this wishing_code
            dispatch({ 
              type: 'SET_ERROR', 
              payload: 'Không tìm thấy thiệp chúc mừng với mã này. Vui lòng kiểm tra lại mã thiệp hoặc liên hệ người gửi.' 
            });
          }
        } else if (result.success) {
          // Handle wrapped response format
          if (result.data && result.data.length > 0) {
            setCardData(result.data[0]);
          } else {
            dispatch({ 
              type: 'SET_ERROR', 
              payload: 'Không tìm thấy thiệp chúc mừng với mã này. Vui lòng kiểm tra lại mã thiệp hoặc liên hệ người gửi.' 
            });
          }
        } else {
          // API returned success: false
          dispatch({ 
            type: 'SET_ERROR', 
            payload: 'Không tìm thấy thiệp chúc mừng với mã này. Vui lòng kiểm tra lại mã thiệp hoặc liên hệ người gửi.' 
          });
        }
      } catch (error) {
        console.log('Error loading card:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Có lỗi xảy ra khi tải thông tin thiệp. Vui lòng thử lại sau.' 
        });
      } finally {
        // Delay 1.5-2s before hiding loading state
        const delay = Math.random() * 500 + 1500; // Random delay between 1.5-2s
        setTimeout(() => {
          setIsLoadingCard(false);
        }, delay);
      }
    };

    loadCardData();
  }, [wishingCode, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!key.trim()) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Vui lòng nhập mã bí mật' 
      });
      return;
    }

    if (!cardData) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Thông tin thiệp chưa được tải. Vui lòng thử lại.' 
      });
      return;
    }

    setIsLoading(true);
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // GAS trả về data với tên field theo header của Sheet
      const cardKey = cardData.key;
      
      // Compare the entered key with the card's key
      if (cardKey === key.trim()) {
        // Key matches, switch to display view
        dispatch({ type: 'SET_CARD_DATA', payload: cardData });
        dispatch({ type: 'SET_VIEW', payload: 'display' });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Mã bí mật không đúng. Vui lòng kiểm tra lại.' 
        });
      }
    } catch (error) {
      console.log('Error validating key:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Có lỗi xảy ra khi xác thực. Vui lòng thử lại.' 
      });
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Show loading state while loading card data
  if (isLoadingCard) {
    return (
      <div className="key-input-form">
        <div className="loading-container">
          <h1>Thiệp Chúc Mừng Đang Được Tải</h1>
          <p className="loading-description">
            Chúng tôi đang chuẩn bị thiệp chúc mừng đặc biệt dành cho bạn...
          </p>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p className="loading-message">
            Vui lòng chờ trong giây lát để chúng tôi tải thông tin thiệp.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="key-input-form">
      <div className="form-container">
        {error && !cardData ? (
          // Error state - card not found
          <>
            <h1>Không Tìm Thấy Thiệp</h1>
            <p className="form-description">
              Rất tiếc, chúng tôi không thể tìm thấy thiệp chúc mừng với mã này.
            </p>
            <div className="error-message">
              {error}
            </div>
            <div className="help-message">
              <p><strong>Gợi ý:</strong></p>
              <ul>
                <li>Kiểm tra lại mã thiệp từ người gửi</li>
                <li>Đảm bảo mã thiệp được nhập chính xác</li>
                <li>Liên hệ người gửi để xác nhận mã thiệp</li>
              </ul>
            </div>
          </>
        ) : cardData ? (
          // Success state - card found, show form
          <>
            <h1>Thiệp Chúc Mừng Đã Sẵn Sàng!</h1>
            <p className="form-description">
              Chúng tôi đã tìm thấy thiệp chúc mừng dành cho bạn! 
              Vui lòng nhập mã bí mật để xem thiệp.
            </p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="form">
              <FormField
                label="Mã bí mật"
                type="text"
                value={key}
                onChange={(value) => {
                  setKey(value);
                  if (error) {
                    dispatch({ type: 'CLEAR_ERROR' });
                  }
                }}
                placeholder="Nhập mã bí mật"
                required
                autoFocus
              />
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? 'Đang kiểm tra...' : 'Xem Thiệp'}
              </Button>
            </form>
          </>
        ) : (
          // Default state - waiting for data
          <>
            <h1>Thiệp Chúc Mừng Đang Được Tải</h1>
            <p className="form-description">
              Chúng tôi đang chuẩn bị thiệp chúc mừng đặc biệt dành cho bạn...
            </p>
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p className="loading-message">
              Vui lòng chờ trong giây lát để chúng tôi tải thông tin thiệp.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
