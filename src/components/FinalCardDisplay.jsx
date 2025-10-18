import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import CardPreview from './CardPreview';
import Button from './Button';
import Confetti from './Confetti';
import FloatingHearts from './FloatingHearts';
import FloatingSnow from './FloatingSnow';
import Fireworks from './Fireworks';
import FloatingStars from './FloatingStars';
import FloatingBubbles from './FloatingBubbles';

export default function FinalCardDisplay() {
  const { cardData } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (cardData) {
      console.log('FinalCardDisplay - Card data:', cardData);
      console.log('FinalCardDisplay - Theme ID:', cardData.theme_id);
      console.log('FinalCardDisplay - Template ID:', cardData.template_id);
      
      // Trigger celebration animation when card data is loaded
      setShowCelebration(true);
      
      // Keep celebration running forever - no timer to stop it
    }
  }, [cardData]);

  if (!cardData) {
    return (
      <div className="error-container">
        <h1>Không tìm thấy dữ liệu thiệp</h1>
        <p>Vui lòng kiểm tra lại link thiệp.</p>
      </div>
    );
  }

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      console.log('Link thiệp đã được sao chép vào clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Link thiệp đã được sao chép!');
    });
  };

  return (
    <div className={`final-card-display theme-${cardData.theme_id || 'classic'}`}>
      <div className="final-card-container">
        <div className="final-card-wrapper">
          <CardPreview 
            data={cardData}
            themeId={cardData.theme_id}
            templateId={cardData.template_id}
            isFinal={true}
          />
        </div>
      </div>
      
      {/* Celebration effects - based on cardData.effect */}
      {cardData.effect === 'confetti' && <Confetti isActive={showCelebration} />}
      {cardData.effect === 'hearts' && <FloatingHearts isActive={showCelebration} />}
      {cardData.effect === 'snow' && <FloatingSnow isActive={showCelebration} />}
      {cardData.effect === 'fireworks' && <Fireworks isActive={showCelebration} />}
      {cardData.effect === 'stars' && <FloatingStars isActive={showCelebration} />}
      {cardData.effect === 'bubbles' && <FloatingBubbles isActive={showCelebration} />}
    </div>
  );
}
