#!/bin/bash

# 🔧 ESLint ve Dev Dependencies Hızlı Kurulum

echo "🔧 ESLint ve eksik dev dependencies kuruluyor..."

# 1. ESLint ve ilgili paketleri kur
echo "📦 ESLint packages installing..."
npm install --save-dev eslint@^9.15.0 @eslint/js@^9.15.0 eslint-plugin-react@^7.37.2 eslint-plugin-react-hooks@^5.0.0

# 2. Prettier'ı da kur
echo "🎨 Prettier installing..."
npm install --save-dev prettier@^3.3.3

# 3. ESLint config'i kontrol et
echo "⚙️  ESLint config checking..."

# 4. Test çalıştır
echo "🧪 Testing ESLint..."
npx eslint --version

echo "✅ Setup completed!"
echo ""
echo "🚀 Şimdi şunları çalıştırın:"
echo "   npm run lint"
echo "   npm run build"
echo "   npm start"