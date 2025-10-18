import React from 'react';
import { getThemeClasses, getTemplateStructure } from '../utils/themeUtils';

export default function CardPreview({ 
  data, 
  themeId = 'theme1', 
  templateId = 'template1',
  isFinal = false 
}) {
  console.log('CardPreview - themeId:', themeId);
  console.log('CardPreview - templateId:', templateId);
  
  const themeClasses = getThemeClasses(themeId);
  const templateStructure = getTemplateStructure(templateId);
  
  console.log('CardPreview - themeClasses:', themeClasses);
  console.log('CardPreview - templateStructure:', templateStructure);
  
  // Fill template with actual data
  const renderTemplate = () => {
    if (!templateStructure) {
      return (
        <div className="default-template">
          <div className="card-content">
            <h2>Lời chúc</h2>
            <p className="wishing-text">{data.wishing || 'Nhập lời chúc...'}</p>
            <div className="signature">
              <p>— {data.from_name || 'Người gửi'}</p>
            </div>
          </div>
        </div>
      );
    }


    // Replace placeholders with actual data
    let htmlContent = templateStructure.html;
    htmlContent = htmlContent.replace(/\{wishing\}/g, data.wishing || 'Nhập lời chúc...');
    htmlContent = htmlContent.replace(/\{from_name\}/g, data.from_name || 'Người gửi');
    htmlContent = htmlContent.replace(/\{to_name\}/g, data.to_name || 'Người nhận');
    htmlContent = htmlContent.replace(/\{title\}/g, data.title || data.holiday_title || 'Lời chúc');
    htmlContent = htmlContent.replace(/\{date\}/g, data.date || '');
    htmlContent = htmlContent.replace(/\{created_at\}/g, 
      data.created_at ? new Date(data.created_at).toLocaleDateString('vi-VN') : ''
    );

    return (
      <div 
        className="template-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  return (
    <div className={`card-preview ${isFinal ? 'final-card' : 'preview-card'}`}>
      <div className={`card-inner ${themeClasses}`}>
        {renderTemplate()}
      </div>
      
      {!isFinal && (
        <div className="preview-overlay">
          <span>Xem trước</span>
        </div>
      )}
    </div>
  );
}
