import { memo, useState } from 'react';
import { Upload, Camera, Trash2, ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';

import {
  PaymentTypes,
  CurrencyTypes,
  CurrencySymbols,
  BrandTypes,
  CategoryTypes,
} from '../constants/types';
import { addDirectionSuffix } from '../utils/stringHelpers';

const formatAmount = (amount, currency) => {
  if (!amount) return '0';
  const formattedAmount = parseFloat(amount).toLocaleString('tr-TR');
  const symbol = CurrencySymbols[currency] || currency;
  return `${formattedAmount} ${symbol}`;
};

export const TutanakTemplate = memo(
  ({
    formData,
    selectedBrand,
    selectedCategory,
    payments,
    currentDate,
    totalAmountsByCurrency = {},
  }) => {
    const [uploadedIdImage, setUploadedIdImage] = useState(null);
    const [imageTransform, setImageTransform] = useState({
      scale: 1,
      translateX: 0,
      translateY: 0
    });

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedIdImage(e.target.result);
          setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleCameraCapture = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = handleImageUpload;
      input.click();
    };

    const handleDeleteImage = () => {
      setUploadedIdImage(null);
      setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
    };

    const handleZoomIn = (amount = 0.05) => {
      setImageTransform(prev => ({
        ...prev,
        scale: Math.min(prev.scale + amount, 3)
      }));
    };

    const handleZoomOut = (amount = 0.05) => {
      setImageTransform(prev => ({
        ...prev,
        scale: Math.max(prev.scale - amount, 0.3)
      }));
    };

    const handleMove = (direction, isFine = true) => {
      const amount = isFine ? 2 : 8;
      setImageTransform(prev => {
        const newTransform = { ...prev };
        const limit = 150;
        
        switch (direction) {
          case 'up':
            newTransform.translateY = Math.max(prev.translateY - amount, -limit);
            break;
          case 'down':
            newTransform.translateY = Math.min(prev.translateY + amount, limit);
            break;
          case 'left':
            newTransform.translateX = Math.max(prev.translateX - amount, -limit);
            break;
          case 'right':
            newTransform.translateX = Math.min(prev.translateX + amount, limit);
            break;
        }
        return newTransform;
      });
    };

    const handleMouseDown = (direction) => {
      let timeoutId;
      let intervalId;
      
      // İlk tıklama - hassas ayar
      handleMove(direction, true);
      
      // 300ms sonra normal ayara geç
      timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          handleMove(direction, false);
        }, 100);
      }, 300);
      
      const cleanup = () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        document.removeEventListener('mouseup', cleanup);
        document.removeEventListener('mouseleave', cleanup);
      };
      
      document.addEventListener('mouseup', cleanup);
      document.addEventListener('mouseleave', cleanup);
    };

    const handleReset = () => {
      setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
    };
    const isCufflinks = selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR;
    const productType = isCufflinks ? 'aksesuar' : 'saat';
    const productTypeGenitive = isCufflinks ? 'aksesuarın' : 'saatin';

    // Müşteri ve teslim alan kişi isimleri
    const customerName = formData.musteri || '';
    const customerNameWithSuffix = addDirectionSuffix(customerName);
    const recipientName = formData.teslimEdilenKisi || customerName;
    const recipientNameWithSuffix = addDirectionSuffix(recipientName);

    // Ödeme metinlerini oluştur
    const generatePaymentText = () => {
      const texts = [];
      
      // Cari ödemesi var mı kontrol et
      const hasCariPayment = payments.some(p => p.type === PaymentTypes.CARI);
      const nonCariPayments = payments.filter(p => p.type !== PaymentTypes.CARI);
      const cariPayments = payments.filter(p => p.type === PaymentTypes.CARI);

      // Her ödemeyi ayrı ayrı ekle
      nonCariPayments.forEach((payment) => {
        const amount = formatAmount(payment.amount, payment.currency);
        const date = payment.date || currentDate;

        switch (payment.type) {
          case PaymentTypes.HAVALE: {
            let iban = '';
            if (payment.currency === CurrencyTypes.TL) {
              iban = 'TR760006200010000006292310';
            } else if (payment.currency === CurrencyTypes.EUR) {
              iban = 'TR540006200010000009083008';
            } else if (payment.currency === CurrencyTypes.USD) {
              iban = 'TR810006200010000009083007';
            }
            texts.push(`${date} tarihinde IBAN: ${iban} nolu hesaba ${amount} ödeme gerçekleştirilmiştir.`);
            break;
          }

          case PaymentTypes.KREDI_KARTI:
            texts.push(`${date} tarihinde Kredi Kartı ile ${amount} ödeme gerçekleştirilmiştir.`);
            break;

          case PaymentTypes.LINK:
            texts.push(`${date} tarihinde Link ile ${amount} ödeme gerçekleştirilmiştir.`);
            break;

          default:
            texts.push(`${date} tarihinde ${payment.type} ile ${amount} ödeme gerçekleştirilmiştir.`);
        }
      });

      // Eğer ödeme varsa "İşbu ödeme ile" açıklamasını ekle
      if (nonCariPayments.length > 0) {
        if (isCufflinks) {
          texts.push(`İşbu ödeme ile, ${selectedBrand.toUpperCase()} marka ${formData.rmc || ''} ürün koduna sahip, ${formData.seri || ''} seri numaralı, ${formData.description || ''} aksesuarın satışı gerçekleştirilmiştir.`);
        } else {
          texts.push(`İşbu ödeme ile, ${selectedBrand.toUpperCase()} marka ${formData.rmc || ''} ürün koduna sahip, ${formData.seri || ''} seri numaralı, ${formData.size || ''} mm çapında ${formData.aile || ''} ailesine ait bir saatin satışı gerçekleştirilmiştir.`);
        }
      }

      // Cari ödemeleri ekle
      cariPayments.forEach((payment) => {
        const amount = formatAmount(payment.amount, payment.currency);
        
        if (nonCariPayments.length > 0) {
          // Kısmi ödeme durumu
          if (isCufflinks) {
            texts.push(`Aksesuarın kalan bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`);
          } else {
            texts.push(`Saatin kalan bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`);
          }
        } else {
          // Sadece cari ödeme varsa (eski format)
          if (isCufflinks) {
            texts.push(`KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ. tarafından ${selectedBrand === BrandTypes.ROLEX ? 'ROLEX' : selectedBrand === BrandTypes.TUDOR ? 'TUDOR' : 'CUFFLINKS'} ${formData.rmc || ''} ürün koduna sahip, ${formData.description || ''} ${productTypeGenitive} satışı Alıcı-Müşteri ${customerNameWithSuffix} gerçekleştirilmiş, ancak ${productTypeGenitive} bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`);
          } else {
            texts.push(`KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ. tarafından ${selectedBrand === BrandTypes.ROLEX ? 'ROLEX' : selectedBrand === BrandTypes.TUDOR ? 'TUDOR' : selectedBrand} ${formData.rmc || ''} ürün koduna sahip, ${formData.seri || ''} seri numaralı, ${formData.size || ''}mm çapında ${formData.aile || ''} ailesine ait ${productTypeGenitive} satışı Alıcı-Müşteri ${customerNameWithSuffix} gerçekleştirilmiş, ancak ${productTypeGenitive} bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`);
          }
        }
      });

      return texts;
    };

    const paymentTexts = generatePaymentText();

    // Toplam tutarı hesapla
    const totalText = () => {
      const paidAmounts = {};
      const cariAmounts = {};
      
      // Ödenen tutarları topla
      payments.forEach(payment => {
        if (payment.type !== PaymentTypes.CARI) {
          const currency = payment.currency;
          const amount = parseFloat(payment.amount) || 0;
          paidAmounts[currency] = (paidAmounts[currency] || 0) + amount;
        } else {
          const currency = payment.currency;
          const amount = parseFloat(payment.amount) || 0;
          cariAmounts[currency] = (cariAmounts[currency] || 0) + amount;
        }
      });
      
      const parts = [];
      
      // Ödenen tutarları ekle
      Object.entries(paidAmounts).forEach(([currency, amount]) => {
        parts.push(formatAmount(amount, currency));
      });
      
      // Cari tutarları ekle
      Object.entries(cariAmounts).forEach(([currency, amount]) => {
        parts.push(`${formatAmount(amount, currency)} Cari`);
      });
      
      return parts.length > 0 ? parts.join(' + ') : '0 ₺';
    };

    return (
      <div className="print-page-wrapper" style={{
        backgroundColor: '#F4FCFB !important',
        background: '#F4FCFB !important',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#000',
        padding: '0',
        boxShadow: 'none',
        border: 'none',
        margin: '0 auto',
        width: '210mm',
        height: '297mm',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Ekran ve print için ortak background */
            html, body, #root, .App {
              background: #F4FCFB !important;
              background-color: #F4FCFB !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* TutanakTemplate wrapper'ı aynı renge ayarla */
            .print-page-wrapper {
              background: #F4FCFB !important;
              background-color: #F4FCFB !important;
            }
            
            @media print {
              /* Sayfa ayarları */
              @page {
                size: A4;
                margin: 0;
              }

              /* Color adjustment */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Body ve HTML temizliği - Print için beyaz */
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                background-color: white !important;
                width: 100% !important;
                height: 100% !important;
              }
              
              /* Container dışındaki alanları da beyaz yap */
              body::before, body::after {
                background: white !important;
                background-color: white !important;
              }
              
              /* Ensure white background for all elements */
              #root, .App, main, div {
                background-color: transparent !important;
              }
              
              /* Override all background colors to white/transparent */
              .bg-green-50, .bg-blue-50, .bg-gray-50, .bg-grey-50,
              [class*="bg-green"], [class*="bg-blue"], [class*="bg-gray"], [class*="bg-grey"],
              [class*="bg-mint"], [class*="bg-teal"], [class*="bg-emerald"],
              [class*="bg-slate"], [class*="bg-zinc"], [class*="bg-neutral"], [class*="bg-stone"] {
                background-color: white !important;
                background: white !important;
              }
              
              /* Specific white background for print container - print için */
              .print-container {
                background: white !important;
                background-color: white !important;
              }
              
              /* Ensure all text elements have white/transparent background */
              p, span, div, section, article, h1, h2, h3, h4, h5, h6,
              strong, em, b, i, u {
                background-color: transparent !important;
                background: transparent !important;
              }
              
              /* Force all elements to have white/transparent background */
              *, *::before, *::after {
                background-color: white !important;
                background: white !important;
              }
              
              /* Extra override for TUDOR gray backgrounds */
              .print-page-wrapper, .print-page-wrapper * {
                background-color: white !important;
                background: white !important;
              }
              
              /* Exception: print container and body should stay white */
              .print-container, body, html {
                background-color: white !important;
                background: white !important;
              }
              
              /* Kimlik kartı alanı için özel print stilleri */
              .id-card-area {
                background-color: white !important;
                border: 1px solid #666 !important;
                page-break-inside: avoid !important;
              }
              
              /* Kimlik kartı bölümü sayfa sığmazsa yeni sayfaya geç */
              div[style*="pageBreakInside"] {
                page-break-inside: avoid !important;
              }
              
              /* Print container içinde sayfa kırılmasını optimize et */
              .print-container {
                width: 210mm !important;
                padding: 15mm 15mm !important;
                margin: 0 auto !important;
                min-height: auto !important;
              }
              
              /* Yeni sayfa için sayfa kırılması kuralları */
              div[style*="pageBreakBefore"] {
                page-break-before: always !important;
                page-break-inside: avoid !important;
              }

              /* Gölgeleri kaldır */
              * {
                box-shadow: none !important;
                text-shadow: none !important;
              }

              /* Print container */
              .print-container {
                width: 210mm !important;
                height: 297mm !important;
                padding: 15mm 15mm 80mm 15mm !important;
                margin: 0 auto !important;
                position: relative !important;
                box-sizing: border-box !important;
              }
              
              /* Sabit A4 boyutları - Print için beyaz */
              .print-page-wrapper {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 auto !important;
                overflow: hidden !important;
                background: white !important;
                background-color: white !important;
              }
              
              /* Viewport'u ekran rengiyle uyumlu yap */
              @media screen {
                body {
                  background: #F4FCFB !important;
                  background-color: #F4FCFB !important;
                }
                .print-page-wrapper {
                  box-shadow: 0 0 0 100vw #F4FCFB !important;
                }
              }

              /* Logoların görünmesi için */
              img {
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                max-width: 100% !important;
                height: auto !important;
                background: white !important;
                background-color: white !important;
              }

              .logo-container {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 20px !important;
                background: white !important;
                background-color: white !important;
              }

              .logo-container img {
                height: 60px !important;
                width: auto !important;
                background: white !important;
                background-color: white !important;
              }

              /* Butonları gizle */
              .print\\\\:hidden {
                display: none !important;
              }
            }
          `
        }} />
        <div className="print-container" style={{ 
          padding: '15mm',
          paddingBottom: '80mm',
          height: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          backgroundColor: '#F4FCFB'
        }}>
          {/* Logo Bölümü */}
          <div className="logo-container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '5px 0'
          }}>
            <img src="/images/rolex.png" alt="Rolex" style={{ height: '45px', width: 'auto' }} />
            <img src="/images/kulahcioglu.png" alt="Külahçıoğlu" style={{ height: '45px', width: 'auto' }} />
            <img src="/images/tudor.png" alt="Tudor" style={{ height: '45px', width: 'auto' }} />
          </div>

          <br />
          <br />

          {/* Tarih - sağa dayalı */}
          <p style={{ textAlign: 'right', margin: '8px 0' }}>İZMİR - {currentDate}</p>

          <br />
          <br />

          {/* Başlık - ortalı */}
          <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', margin: '12px 0' }}>TESLİM TUTANAK</h1>

          <br />
          <br />

          {/* Ana Metin */}
          <p>Alıcı - Müşteri <strong>{customerName}</strong> tarafından, KÜLAHÇIOĞLU DIŞ TİCARET LTD. ŞTİ. Adına;</p>
          
          <br />

          {paymentTexts.map((text, index) => {
            // Ödeme satırları mı yoksa açıklama satırları mı?
            const isPaymentLine = text.includes('ödeme gerçekleştirilmiştir');
            const isLastPaymentLine = isPaymentLine && 
              (index + 1 >= paymentTexts.length || !paymentTexts[index + 1].includes('ödeme gerçekleştirilmiştir'));
            
            return (
              <div key={index}>
                <p style={{ margin: '0' }}>{text}</p>
                {isLastPaymentLine && <br />}
              </div>
            );
          })}

          <p style={{ margin: '8px 0' }}>Toplam Tutar: <strong>{totalText()}</strong></p>

          <p style={{ margin: '8px 0' }}>İşbu belge ile; Yukarıda belirtilen özelliklere sahip {productTypeGenitive} tüm yasal ve ticari belgeleriyle birlikte eksiksiz olarak hazırlandığı, müşteri talimatı doğrultusunda {!isCufflinks && 'seri numarası,'} kodu ve fiziksel özelliklerinin kontrol edilip doğrulandığı, herhangi bir eksiklik veya hasar bulunmadığının tespit edildiği, Söz konusu {productType} ve tüm belgelerinin asıl sahibi {customerName} adına, vekili/temsilcisi {recipientNameWithSuffix} eksiksiz olarak teslim edildiği beyan edilir.</p>

          <p style={{ margin: '12px 0', fontWeight: 'bold' }}><strong>YUKARIDAKİ {productType.toUpperCase()} VE BELGELERİNİ EKSİKSİZ OLARAK TESLİM ALDIM.</strong></p>

          <p style={{ margin: '4px 0' }}>Ad-Soyad: {recipientName}</p>
          <p style={{ margin: '4px 0' }}>Tarih: {currentDate}</p>
          <br />
          <p style={{ margin: '8px 0' }}>İmza: .....................................................................</p>
          
          {/* Kimlik Kartı Alanı - Sol alt köşede sabit */}
          <div style={{ 
            position: 'absolute',
            bottom: '15mm',
            left: '15mm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <h2 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              textAlign: 'left',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Teslim Alan TC Kimlik Kartı
            </h2>
            <div className="id-card-area" style={{
                width: '85.60mm',
                height: '53.98mm',
                border: '1px solid #666',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {uploadedIdImage ? (
                  <>
                    <img 
                      src={uploadedIdImage} 
                      alt="Yüklenen Kimlik" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        transform: `scale(${imageTransform.scale}) translate(${imageTransform.translateX}px, ${imageTransform.translateY}px)`,
                        transformOrigin: 'center',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                    
                    {/* Delete button */}
                    <button
                      onClick={handleDeleteImage}
                      className="print:hidden"
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}
                      title="Fotoğrafı Sil"
                    >
                      <Trash2 size={12} stroke="#666" />
                    </button>

                    {/* Compact Control Panel */}
                    <div className="print:hidden" style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gridTemplateRows: 'repeat(3, 1fr)',
                      gap: '2px',
                      background: 'rgba(255, 255, 255, 0.4)',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.6)'
                    }}>
                      {/* Top Row */}
                      <button onClick={() => handleZoomOut(0.05)} style={{ 
                        background: 'rgba(255, 255, 255, 0.3)', 
                        border: 'none', 
                        borderRadius: '6px',
                        width: '20px', 
                        height: '20px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }} title="Küçült">
                        <ZoomOut size={10} stroke="#666" />
                      </button>
                      <button 
                        onMouseDown={() => handleMouseDown('up')}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.3)', 
                          border: 'none', 
                          borderRadius: '6px',
                          width: '20px', 
                          height: '20px',
                          cursor: 'pointer', 
                          fontSize: '12px', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          userSelect: 'none',
                          fontWeight: 'bold'
                        }} 
                        title="Yukarı"
                      >
                        ↑
                      </button>
                      <button onClick={() => handleZoomIn(0.05)} style={{ 
                        background: 'rgba(255, 255, 255, 0.3)', 
                        border: 'none', 
                        borderRadius: '6px',
                        width: '20px', 
                        height: '20px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }} title="Büyült">
                        <ZoomIn size={10} stroke="#666" />
                      </button>
                      
                      {/* Middle Row */}
                      <button 
                        onMouseDown={() => handleMouseDown('left')}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.3)', 
                          border: 'none', 
                          borderRadius: '6px',
                          width: '20px', 
                          height: '20px',
                          cursor: 'pointer', 
                          fontSize: '12px', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          userSelect: 'none',
                          fontWeight: 'bold'
                        }} 
                        title="Sol"
                      >
                        ←
                      </button>
                      <button onClick={handleReset} style={{ 
                        background: 'rgba(255, 255, 255, 0.5)', 
                        border: 'none', 
                        borderRadius: '6px',
                        width: '20px', 
                        height: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }} title="Sıfırla">
                        <RotateCcw size={10} stroke="#666" />
                      </button>
                      <button 
                        onMouseDown={() => handleMouseDown('right')}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.3)', 
                          border: 'none', 
                          borderRadius: '6px',
                          width: '20px', 
                          height: '20px',
                          cursor: 'pointer', 
                          fontSize: '12px', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          userSelect: 'none',
                          fontWeight: 'bold'
                        }} 
                        title="Sağ"
                      >
                        →
                      </button>
                      
                      {/* Bottom Row */}
                      <button onClick={() => handleZoomOut(0.02)} style={{ 
                        background: 'rgba(255, 255, 255, 0.3)', 
                        border: 'none', 
                        borderRadius: '6px',
                        width: '20px', 
                        height: '20px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'normal'
                      }} title="İnce Küçült">−</button>
                      <button 
                        onMouseDown={() => handleMouseDown('down')}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.3)', 
                          border: 'none', 
                          borderRadius: '6px',
                          width: '20px', 
                          height: '20px',
                          cursor: 'pointer', 
                          fontSize: '12px', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          userSelect: 'none',
                          fontWeight: 'bold'
                        }} 
                        title="Aşağı"
                      >
                        ↓
                      </button>
                      <button onClick={() => handleZoomIn(0.02)} style={{ 
                        background: 'rgba(255, 255, 255, 0.3)', 
                        border: 'none', 
                        borderRadius: '6px',
                        width: '20px', 
                        height: '20px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }} title="İnce Büyült">+</button>
                    </div>
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '10px',
                      color: '#666',
                      fontWeight: 'normal',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}>
                      TC KİMLİK KARTI
                    </span>
                    <div className="print:hidden" style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => document.getElementById('id-upload').click()}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Dosya Yükle"
                      >
                        <Upload size={16} stroke="#666" />
                      </button>
                      <button
                        onClick={handleCameraCapture}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Fotoğraf Çek"
                      >
                        <Camera size={16} stroke="#666" />
                      </button>
                    </div>
                  </div>
                )}
                <input
                  id="id-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
          </div>
        </div>
      </div>
    );
  }
);

TutanakTemplate.displayName = 'TutanakTemplate';

export default TutanakTemplate;
