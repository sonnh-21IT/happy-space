// Theme utilities for managing card themes and templates

export const getThemeClasses = (themeId) => {
  const themes = {
    'classic_theme': 'theme-classic',
    'modern_theme': 'theme-modern', 
    'romantic_theme': 'theme-romantic',
    'previous_theme': 'theme-previous',
    'ocean_theme': 'theme-ocean',
    'forest_theme': 'theme-forest',
    'sunset_theme': 'theme-sunset',
    'lavender_theme': 'theme-lavender',
    'golden_theme': 'theme-golden',
    'midnight_theme': 'theme-midnight'
  };
  
  return themes[themeId] || themes['classic_theme'];
};

export const getTemplateStructure = (templateId) => {
  const templates = {
    'classic_template': {
      html: `
        <div class="template-1">
          <div class="card-header">
            <h2>{title}</h2>
            <p class="to-name">Gửi: {to_name}</p>
          </div>
          <div class="card-body">
            <p class="wishing-text">{wishing}</p>
          </div>
          <div class="card-signature">
            <p class="signature">{from_name}</p>
          </div>
        </div>
      `
    },
    template2: {
      html: `
        <div class="template-2">
          <div class="card-content">
            <div class="wishing-container">
              <p class="wishing-text">{wishing}</p>
            </div>
            <div class="signature-container">
              <p class="signature">{from_name}</p>
              <p class="date">{created_at}</p>
            </div>
          </div>
        </div>
      `
    },
    template3: {
      html: `
        <div class="template-3">
          <div class="card-wrapper">
            <div class="wishing-section">
              <h3>Lời chúc</h3>
              <p class="wishing-text">{wishing}</p>
            </div>
            <div class="author-section">
              <p class="from-name">{from_name}</p>
              <p class="date">{created_at}</p>
            </div>
          </div>
        </div>
      `
    },
    'womens_day_template': {
      html: `
        <div class="template-womens-day">
          <div class="background-decoration">
            <div class="heart-border"></div>
            <div class="floating-shapes">
              <div class="shape heart-shape"></div>
              <div class="shape star-shape"></div>
              <div class="shape circle-shape"></div>
              <div class="shape heart-shape"></div>
              <div class="shape star-shape"></div>
              <div class="shape circle-shape"></div>
              <div class="shape heart-shape"></div>
              <div class="shape star-shape"></div>
            </div>
          </div>
          <div class="card-content">
            <div class="greeting">Gửi em!</div>
            <div class="wishing-text">{wishing}</div>
            <div class="shapes-decoration">
              <div class="shape heart-shape"></div>
              <div class="shape star-shape"></div>
              <div class="shape circle-shape"></div>
              <div class="shape heart-shape"></div>
              <div class="shape star-shape"></div>
              <div class="shape circle-shape"></div>
            </div>
            <div class="signature">{from_name}</div>
            <div class="date">{created_at}</div>
          </div>
          <div class="decorations">
            <div class="shape balloon-shape"></div>
            <div class="shape gift-shape"></div>
            <div class="shape heart-shape"></div>
            <div class="shape star-shape"></div>
            <div class="shape circle-shape"></div>
            <div class="shape balloon-shape"></div>
            <div class="shape gift-shape"></div>
          </div>
        </div>
      `
    },
    'modern_template': {
      html: `
        <div class="template-modern">
          <div class="modern-header">
            <div class="modern-title">
              <h2>{title}</h2>
            </div>
            <div class="modern-to">
              <span class="to-label">Gửi đến:</span>
              <span class="to-name">{to_name}</span>
            </div>
          </div>
          <div class="modern-content">
            <div class="wishing-box">
              <p class="wishing-text">{wishing}</p>
            </div>
          </div>
          <div class="card-signature">
            <p class="signature">{from_name}</p>
          </div>
        </div>
      `
    },
    'romantic_template': {
      html: `
        <div class="template-romantic">
          <div class="romantic-hearts">
            <div class="shape heart-shape"></div>
            <div class="shape star-shape"></div>
            <div class="shape circle-shape"></div>
            <div class="shape heart-shape"></div>
            <div class="shape star-shape"></div>
            <div class="shape circle-shape"></div>
            <div class="shape heart-shape"></div>
            <div class="shape star-shape"></div>
          </div>
          <div class="romantic-content">
            <div class="romantic-title">
              <h2>{title}</h2>
            </div>
            <div class="romantic-to">
              <p class="to-name">Gửi: {to_name}</p>
            </div>
            <div class="romantic-wishing">
              <div class="wishing-border">
                <p class="wishing-text">{wishing}</p>
              </div>
            </div>
          </div>
          <div class="card-signature">
            <p class="signature">{from_name}</p>
          </div>
        </div>
      `
    }
  };
  
  return templates[templateId] || templates['classic_template'];
};
