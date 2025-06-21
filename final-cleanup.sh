#!/bin/bash

# 🧹 Final Cleanup Script
# Unused files ve ESLint warnings'leri temizler

echo "🧹 Final cleanup başlıyor..."

# 1. Unused/broken files cleanup
echo "📂 Unused files kaldırılıyor..."
rm -f src/components/TutanakTemplate_Broken.js
rm -f src/components/LazyWrapper.js
rm -f eslint
rm -f teslim-tutanak-form-app@1.0.0

# 2. ESLint warnings düzeltme
echo "⚠️ ESLint warnings düzeltiliyor..."

# paymentHelpers.js'deki unused _e parametrelerini düzelt
sed -i '' 's/} catch (_e) {/} catch {/g' src/utils/paymentHelpers.js

# stringHelpers.js'deki unused _e parametresini düzelt  
sed -i '' 's/} catch (_e) {/} catch {/g' src/utils/stringHelpers.js

echo "✅ Cleanup tamamlandı!"

echo ""
echo "🎯 Final test yapın:"
echo "   npm run lint    # 0 errors, çok az warning"
echo "   npm run build   # SUCCESS"
echo "   npm audit       # Güvenlik kontrolü"
