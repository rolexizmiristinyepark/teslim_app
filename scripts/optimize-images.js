/**
 * Image Optimization Script
 * Bu script mevcut PNG görsellerini WebP formatına çevirir ve optimize eder
 */

const imagemin = require('imagemin').default;
const imageminWebp = require('imagemin-webp').default;
const imageminPngquant = require('imagemin-pngquant').default;
const imageminMozjpeg = require('imagemin-mozjpeg').default;
const fs = require('fs');
const path = require('path');

// Directories
const INPUT_DIR = 'public';
const OUTPUT_DIR = 'public/optimized';

async function optimizeImages() {
  console.log('🔧 Starting image optimization...');
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Create subdirectories
    const subdirs = ['images', 'images_cufflinks'];
    subdirs.forEach(subdir => {
      const outputSubdir = path.join(OUTPUT_DIR, subdir);
      if (!fs.existsSync(outputSubdir)) {
        fs.mkdirSync(outputSubdir, { recursive: true });
      }
    });

    console.log('📁 Processing cufflinks images...');
    
    // Optimize cufflinks images (PNG to WebP)
    const cufflinksResults = await imagemin([`${INPUT_DIR}/images_cufflinks/*.png`], {
      destination: `${OUTPUT_DIR}/images_cufflinks`,
      plugins: [
        imageminWebp({
          quality: 85, // WebP quality (0-100)
          method: 6,   // Compression method (0-6, higher = better compression)
          autoFilter: true
        }),
        imageminPngquant({
          quality: [0.6, 0.8] // PNG fallback quality
        })
      ]
    });

    console.log('📁 Processing brand images...');
    
    // Optimize brand images 
    const brandResults = await imagemin([`${INPUT_DIR}/images/*.png`], {
      destination: `${OUTPUT_DIR}/images`,
      plugins: [
        imageminWebp({
          quality: 90, // Higher quality for brand logos
          method: 6,
          autoFilter: true
        }),
        imageminPngquant({
          quality: [0.7, 0.9]
        })
      ]
    });

    // Process JPEG images if any
    const jpegResults = await imagemin([`${INPUT_DIR}/images/*.{jpg,jpeg}`], {
      destination: `${OUTPUT_DIR}/images`,
      plugins: [
        imageminWebp({
          quality: 85
        }),
        imageminMozjpeg({
          quality: 85
        })
      ]
    });

    // Calculate savings
    const calculateSavings = (results, type) => {
      if (results.length === 0) return { count: 0, originalSize: 0, optimizedSize: 0 };
      
      let originalSize = 0;
      let optimizedSize = 0;
      
      results.forEach(result => {
        const originalPath = result.sourcePath;
        const optimizedPath = result.destinationPath;
        
        if (fs.existsSync(originalPath) && fs.existsSync(optimizedPath)) {
          originalSize += fs.statSync(originalPath).size;
          optimizedSize += fs.statSync(optimizedPath).size;
        }
      });
      
      const savingBytes = originalSize - optimizedSize;
      const savingPercent = originalSize > 0 ? (savingBytes / originalSize * 100).toFixed(1) : 0;
      
      console.log(`${type}:`);
      console.log(`  📊 Files processed: ${results.length}`);
      console.log(`  📏 Original size: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`  🗜️ Optimized size: ${(optimizedSize / 1024).toFixed(1)} KB`);
      console.log(`  💾 Space saved: ${(savingBytes / 1024).toFixed(1)} KB (${savingPercent}%)`);
      
      return { count: results.length, originalSize, optimizedSize, savingBytes, savingPercent };
    };

    const cufflinksSavings = calculateSavings(cufflinksResults, '🔗 Cufflinks Images');
    const brandSavings = calculateSavings(brandResults, '🏷️ Brand Images');
    const jpegSavings = calculateSavings(jpegResults, '🖼️ JPEG Images');

    const totalOriginal = cufflinksSavings.originalSize + brandSavings.originalSize + jpegSavings.originalSize;
    const totalOptimized = cufflinksSavings.optimizedSize + brandSavings.optimizedSize + jpegSavings.optimizedSize;
    const totalSaved = totalOriginal - totalOptimized;
    const totalSavedPercent = totalOriginal > 0 ? (totalSaved / totalOriginal * 100).toFixed(1) : 0;

    console.log('\n🎉 Optimization Complete!');
    console.log('=' .repeat(50));
    console.log(`📂 Total files processed: ${cufflinksResults.length + brandResults.length + jpegResults.length}`);
    console.log(`📏 Total original size: ${(totalOriginal / 1024).toFixed(1)} KB`);
    console.log(`🗜️ Total optimized size: ${(totalOptimized / 1024).toFixed(1)} KB`);
    console.log(`💾 Total space saved: ${(totalSaved / 1024).toFixed(1)} KB (${totalSavedPercent}%)`);
    
    // Create a manifest file
    const manifest = {
      timestamp: new Date().toISOString(),
      optimizations: {
        cufflinks: {
          count: cufflinksResults.length,
          originalSize: cufflinksSavings.originalSize,
          optimizedSize: cufflinksSavings.optimizedSize,
          savings: cufflinksSavings.savingBytes,
          savingsPercent: cufflinksSavings.savingPercent
        },
        brands: {
          count: brandResults.length,
          originalSize: brandSavings.originalSize,
          optimizedSize: brandSavings.optimizedSize,
          savings: brandSavings.savingBytes,
          savingsPercent: brandSavings.savingPercent
        },
        jpeg: {
          count: jpegResults.length,
          originalSize: jpegSavings.originalSize,
          optimizedSize: jpegSavings.optimizedSize,
          savings: jpegSavings.savingBytes,
          savingsPercent: jpegSavings.savingPercent
        }
      },
      total: {
        count: cufflinksResults.length + brandResults.length + jpegResults.length,
        originalSize: totalOriginal,
        optimizedSize: totalOptimized,
        savings: totalSaved,
        savingsPercent: totalSavedPercent
      }
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'optimization-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log(`📋 Optimization manifest created at ${OUTPUT_DIR}/optimization-manifest.json`);

  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeImages();