#!/bin/bash

# 🔒 Güvenlik Açıklarını Çözme Scripti
# Bu script projedeki güvenlik açıklarını güvenli bir şekilde çözer

echo "🔒 Güvenlik Açıklarını Çözmeye Başlıyoruz..."

# 1. Backup kontrolü
if [ ! -f "backups/package.json.backup" ]; then
    echo "❌ Backup bulunamadı! Script durduruluyor."
    exit 1
fi

echo "✅ Backup confirmed."

# 2. Current directory check
if [ ! -f "package.json" ]; then
    echo "❌ package.json bulunamadı! Doğru dizinde olduğunuzdan emin olun."
    exit 1
fi

# 3. Node.js sürüm kontrolü
NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
if [ $NODE_VERSION -lt 18 ]; then
    echo "⚠️  Node.js $NODE_VERSION detected. Önerilen: Node.js 18+"
    echo "🔄 OpenSSL legacy provider korunacak..."
    LEGACY_MODE=true
else
    echo "✅ Node.js $NODE_VERSION detected. Legacy provider kaldırılacak."
    LEGACY_MODE=false
fi

# 4. Cache temizleme
echo "🧹 Cache temizleniyor..."
npm cache clean --force

# 5. Node modules temizleme
echo "🗑️  Node modules temizleniyor..."
rm -rf node_modules
rm -f package-lock.json

# 6. Dependencies güncelleme (güvenli)
echo "📦 Dependencies güncelleniyor..."

# React ve React-DOM patch güncellemesi
npm install react@^18.3.1 react-dom@^18.3.1 --save
echo "✅ React core updated to 18.3.1"

# date-fns güncelleme (major değil, güvenli)
npm install date-fns@^3.6.0 --save
echo "✅ date-fns updated to 3.6.0"

# Dev dependencies güncelleme (daha güvenli)
npm install prettier@^3.3.3 --save-dev
npm install @tailwindcss/forms@^0.5.7 --save-dev
npm install @tailwindcss/typography@^0.5.15 --save-dev
npm install autoprefixer@^10.4.20 --save-dev
npm install webpack-bundle-analyzer@^4.10.2 --save-dev
echo "✅ Dev dependencies updated"

# 7. PostCSS güncelleme (güvenlik açığı için kritik)
npm install postcss@^8.4.32 --save-dev
echo "✅ PostCSS updated (security fix)"

# 8. Package.json scripts güncelleme
if [ "$LEGACY_MODE" = false ]; then
    echo "🔄 OpenSSL legacy provider kaldırılıyor..."
    
    # Scripts güncellemesi
    cat > package_updated.json << 'EOF'
{
  "name": "teslim-tutanak-form-app",
  "version": "1.0.0",
  "description": "Rolex, Tudor ve Cufflinks ürünleri için gelişmiş teslim tutanağı oluşturma uygulaması",
  "private": true,
  "dependencies": {
    "date-fns": "^3.6.0",
    "lucide-react": "^0.511.0",
    "papaparse": "^5.5.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "^5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write src/**/*.{js,jsx,css,md}",
    "analyze": "npm run build && npx source-map-explorer 'build/static/js/*.js'",
    "analyze:css": "npm run build && npx source-map-explorer 'build/static/css/*.css'",
    "bundle-stats": "npm run build && npx source-map-explorer 'build/static/js/*.js' --html > bundle-report.html",
    "audit:check": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "security:update": "npm update && npm audit fix"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.15",
    "autoprefixer": "^10.4.20",
    "babel-plugin-transform-remove-console": "^6.9.4",
    "postcss": "^8.4.32",
    "prettier": "^3.3.3",
    "source-map-explorer": "^2.5.3",
    "tailwindcss": "^3.4.17",
    "webpack-bundle-analyzer": "^4.10.2"
  },
  "keywords": [
    "react",
    "rolex",
    "tudor",
    "cufflinks",
    "form",
    "teslim",
    "tutanak",
    "saat",
    "watch"
  ],
  "author": "Serdar Benli",
  "license": "MIT",
  "homepage": "./",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF
    
    mv package_updated.json package.json
    echo "✅ Package.json updated for modern Node.js"
fi

# 9. Fresh install
echo "📦 Fresh install yapılıyor..."
npm install

# 10. Güvenlik audit
echo "🔍 Güvenlik auditi çalıştırılıyor..."
npm audit

# 11. Güvenli fix'ler
echo "🛠️  Güvenli fix'ler uygulanıyor..."
npm audit fix

# 12. Build testi
echo "🏗️  Build testi yapılıyor..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build başarılı!"
    
    # 13. Son audit
    echo "🔍 Son güvenlik kontrolü..."
    npm audit --audit-level=moderate
    
    echo ""
    echo "🎉 Güvenlik güncellemesi tamamlandı!"
    echo ""
    echo "📊 Sonuçlar:"
    echo "✅ Dependencies güncellendi"
    echo "✅ Build başarılı"
    echo "✅ Backup korundu: backups/package.json.backup"
    echo ""
    echo "🚀 Şimdi uygulamayı test edebilirsiniz:"
    echo "   npm start"
    echo ""
    echo "📈 Bundle analizi için:"
    echo "   npm run bundle-stats"
    echo ""
    
else
    echo "❌ Build hatası! Backup'tan geri yükleniyor..."
    cp backups/package.json.backup package.json
    rm -rf node_modules package-lock.json
    npm install
    echo "🔄 Eski sürüm geri yüklendi."
    exit 1
fi

echo "🎯 İpucu: Güvenlik durumunu takip etmek için:"
echo "   npm run audit:check"