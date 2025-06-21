/**
 * Optimized Payment Detail Modal - Ana form tasarımı ile uyumlu
 * - Modal boyutu diğerleriyle aynı (400px)
 * - Input tasarımları ana form ile uyumlu
 * - Action butonları modal dışında (eski tasarım)
 * - Küçük kart tasarımları
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { PaymentTypes, CurrencyTypes, PaymentTypeLabels, CurrencySymbols, BrandTypes, CategoryTypes, BrandColors, CategoryColors } from '../../constants/types';
import { THEME, getPaymentThemeClass } from '../../constants/theme';

const PaymentDetailModal = ({
  selectedBrand,
  selectedCategory,
  currentDate,
  isProductChecked,
  payments: initialPayments = null,
  onPaymentsChange
}) => {
  // Theme class'ını memoize et
  const themeClass = useMemo(() => 
    getPaymentThemeClass(selectedBrand, selectedCategory),
    [selectedBrand, selectedCategory]
  );

  // Aktif marka rengini belirle
  const getSubmitButtonColor = useMemo(() => {
    // Rolex Aksesuar (Cufflinks) için mavi
    if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR) {
      return CategoryColors[CategoryTypes.AKSESUAR].primary; // #003057
    }
    
    // Diğer markalar için marka rengini kullan
    const brandColor = BrandColors[selectedBrand];
    return brandColor ? brandColor.primary : '#22c55e'; // Default yeşil
  }, [selectedBrand, selectedCategory]);

  // Clear button için her zaman kırmızı
  const getClearButtonColor = useMemo(() => '#ef4444', []);



  // Not: Input background renkleri artık CSS variable'ları ile yönetiliyor (useTheme hook'u)

  // İlk ödeme state'ini memoize et
  const initialPaymentState = useMemo(() => 
    initialPayments && initialPayments.length > 0
      ? initialPayments.map((payment, index) => ({
          ...payment,
          isExpanded: index === initialPayments.length - 1
        }))
      : [{
          id: Date.now().toString(),
          type: PaymentTypes.HAVALE,
          amount: '',
          currency: CurrencyTypes.TL,
          date: currentDate,
          isExpanded: true
        }],
    [initialPayments, currentDate]
  );

  const [payments, setPayments] = useState(initialPaymentState);
  const [totalCardExpanded, setTotalCardExpanded] = useState(false);

  // Modal container stili - diğer modallarla aynı boyut
  const modalContainerStyle = useMemo(() => ({
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '400px',
    minWidth: '350px',
  }), []);

  // Payment cards container - modal'ın tüm genişliğini kullan
  const paymentCardsStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    overflowY: 'auto',
    marginBottom: '0',
    paddingRight: '2px',
    paddingBottom: '6px',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: '150px',
    maxHeight: 'none',
    height: 'auto',
  }), []);

  // initialPayments değiştiğinde local state'i güncelle
  useEffect(() => {
    if (initialPayments && initialPayments.length > 0) {
      const paymentsWithExpanded = initialPayments.map((payment, index) => ({
        ...payment,
        isExpanded: index === initialPayments.length - 1
      }));
      setPayments(paymentsWithExpanded);
    }
  }, [initialPayments]);

  // Yeni ödeme oluşturma fonksiyonunu memoize et
  const createNewPayment = useCallback(() => ({
    id: Date.now().toString(),
    type: PaymentTypes.HAVALE,
    amount: '',
    currency: CurrencyTypes.TL,
    date: currentDate,
    isExpanded: true
  }), [currentDate]);

  // Ödeme ekleme fonksiyonunu optimize et
  const addPayment = useCallback(() => {
    setPayments(prev => {
      const minimizedPayments = prev.map(payment => ({
        ...payment,
        isExpanded: false
      }));
      return [...minimizedPayments, createNewPayment()];
    });
  }, [createNewPayment]);

  // Ödeme toggle fonksiyonu
  const togglePayment = useCallback((index) => {
    setPayments(prev => prev.map((payment, i) => 
      i === index ? { ...payment, isExpanded: !payment.isExpanded } : payment
    ));
  }, []);

  // Ödeme güncelleme fonksiyonunu optimize et
  const updatePayment = useCallback((index, field, value) => {
    setPayments(prev => prev.map((payment, i) => {
      if (i === index) {
        return { ...payment, [field]: value };
      }
      return payment;
    }));
  }, []);

  // Ödeme silme fonksiyonunu optimize et
  const removePayment = useCallback((index) => {
    if (payments.length === 1) return;
    setPayments(prev => prev.filter((_, i) => i !== index));
  }, [payments.length]);

  // Toplam tutarı para birimlerine göre grupla ve memoize et
  const totalAmountsByCurrency = useMemo(() => {
    const totals = {};
    
    payments.forEach(payment => {
      const amount = parseFloat(payment.amount) || 0;
      const currency = payment.currency;
      
      if (amount > 0) {
        if (!totals[currency]) {
          totals[currency] = 0;
        }
        totals[currency] += amount;
      }
    });
    
    return totals;
  }, [payments]);

  // Toplam tutar text'ini oluştur
  const totalAmountText = useMemo(() => {
    const currencyEntries = Object.entries(totalAmountsByCurrency);
    
    if (currencyEntries.length === 0) {
      return 'TOPLAM TUTAR: 0 ₺';
    }
    
    if (currencyEntries.length === 1) {
      const [currency, amount] = currencyEntries[0];
      const symbol = CurrencySymbols[currency] || currency;
      return `TOPLAM TUTAR: ${amount.toLocaleString('tr-TR')} ${symbol}`;
    }
    
    const lines = currencyEntries.map(([currency, amount]) => {
      const symbol = CurrencySymbols[currency] || currency;
      return `${amount.toLocaleString('tr-TR')} ${symbol}`;
    });
    
    return lines;
  }, [totalAmountsByCurrency]);

  // Form validasyonunu memoize et
  const allFieldsFilled = useMemo(() => {
    return payments.every(payment =>
      payment.amount &&
      parseFloat(payment.amount) > 0 &&
      payment.type &&
      payment.currency &&
      payment.date
    ) && isProductChecked;
  }, [payments, isProductChecked]);


  // Payments değiştiğinde parent'a bildir
  useEffect(() => {
    if (onPaymentsChange) {
      onPaymentsChange(payments, allFieldsFilled, totalAmountText);
    }
  }, [payments, allFieldsFilled, totalAmountText, onPaymentsChange]);

  // Modal dışına tıklama handler'ı - kartları minimize et
  const handleModalClick = useCallback((e) => {
    // Eğer tıklanan element payment-card veya total-card değilse, tüm kartları minimize et
    if (!e.target.closest('.payment-card') && !e.target.closest('.total-card')) {
      setPayments(prev => prev.map(payment => ({
        ...payment,
        isExpanded: false
      })));
      setTotalCardExpanded(false);
    }
  }, []);

  return (
    <div style={modalContainerStyle} className={`payment-modal ${themeClass}`}>
      {/* Modal Content */}
      <div className="form" style={{
        padding: '12px',
        paddingBottom: '12px',
        paddingTop: '8px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '500px',
        maxHeight: '500px',
        overflow: 'hidden',
      }} onClick={handleModalClick}>
        {/* Toplam tutar başlığı kaldırıldı */}

        {/* Ödeme Kartları */}
        <div style={paymentCardsStyle}>
          {payments.map((payment, index) => (
            <div
              key={payment.id}
              className="payment-card card-style"
              style={{
              padding: '6px',
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: payment.isExpanded ? 'default' : 'pointer',
              minHeight: payment.isExpanded ? 'auto' : '38px',
              borderRadius: '8px',
              margin: '0',
              backgroundColor: '#F4FCFB',
              border: '1px solid #ACBCBF',
              boxShadow: 'none',
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!payment.isExpanded) {
                  togglePayment(index);
                }
              }}
            >
              {/* Kart üst kısmı - ekle/sil butonları - Sadece expanded durumda absolute */}
              {payment.isExpanded && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                  zIndex: 10
                }}>
                  {/* Ekleme Butonu - Sadece son kartta */}
                  {index === payments.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addPayment();
                      }}
                      className="payment-action-btn add-btn"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: '#e0f2fe',
                        color: '#0284c7',
                        border: 'none',
                        fontSize: '16px',
                        lineHeight: '1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '300',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none'
                      }}
                      onMouseEnter={(e) => {
                        const button = e.currentTarget;
                        button.style.background = '#0284c7';
                        button.style.color = '#ffffff';
                        button.style.boxShadow = '0 2px 8px rgba(2, 132, 199, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        const button = e.currentTarget;
                        button.style.background = '#e0f2fe';
                        button.style.color = '#0284c7';
                        button.style.boxShadow = 'none';
                      }}
                      title="Ödeme Ekle"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-fading-plus-icon lucide-circle-fading-plus">
                        <path d="M12 2a10 10 0 0 1 7.38 16.75"/>
                        <path d="M12 8v8"/>
                        <path d="M16 12H8"/>
                        <path d="M2.5 8.875a10 10 0 0 0-.5 3"/>
                        <path d="M2.83 16a10 10 0 0 0 2.43 3.4"/>
                        <path d="M4.636 5.235a10 10 0 0 1 .891-.857"/>
                        <path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/>
                      </svg>
                    </button>
                  )}
                  
                  {/* Silme Butonu */}
                  {payments.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePayment(index);
                      }}
                      className="payment-action-btn remove-btn"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        fontSize: '16px',
                        lineHeight: '1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '300',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none'
                      }}
                      onMouseEnter={(e) => {
                        const button = e.currentTarget;
                        button.style.background = '#dc2626';
                        button.style.color = '#ffffff';
                        button.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        const button = e.currentTarget;
                        button.style.background = '#fee2e2';
                        button.style.color = '#dc2626';
                        button.style.boxShadow = 'none';
                      }}
                      title="Ödemeyi Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Minimize Edilmiş Görünüm */}
              {!payment.isExpanded && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 6px',
                  width: '100%'
                }}>
                  {/* Ödeme Türü - Solda - Sabit genişlik */}
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#495057',
                    flex: '0 0 100px',
                    textAlign: 'left'
                  }}>
                    {PaymentTypeLabels[payment.type]}
                  </div>
                  
                  {/* Tutar - Ortada - Gerçekten ortada */}
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: payment.amount ? '#10b981' : '#cbd5e1',
                    flex: '1',
                    textAlign: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px'
                  }}>
                    {payment.amount ? `${parseInt(payment.amount).toLocaleString('tr-TR')} ${CurrencySymbols[payment.currency]}` : '-'}
                  </div>
                  
                  {/* Butonlar - Sağda - Sabit genişlik */}
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    flex: '0 0 50px',
                    justifyContent: 'flex-end'
                  }}>
                    {/* Ekleme Butonu - Sadece son kartta */}
                    {index === payments.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addPayment();
                        }}
                        className="payment-action-btn add-btn"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: '#e0f2fe',
                          color: '#0284c7',
                          border: 'none',
                          fontSize: '14px',
                          lineHeight: '1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '300',
                          transition: 'all 0.2s ease',
                          boxShadow: 'none'
                        }}
                        onMouseEnter={(e) => {
                          const button = e.currentTarget;
                          button.style.background = '#0284c7';
                          button.style.color = '#ffffff';
                          button.style.boxShadow = '0 2px 8px rgba(2, 132, 199, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          const button = e.currentTarget;
                          button.style.background = '#e0f2fe';
                          button.style.color = '#0284c7';
                          button.style.boxShadow = 'none';
                        }}
                        title="Ödeme Ekle"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-fading-plus-icon lucide-circle-fading-plus">
                          <path d="M12 2a10 10 0 0 1 7.38 16.75"/>
                          <path d="M12 8v8"/>
                          <path d="M16 12H8"/>
                          <path d="M2.5 8.875a10 10 0 0 0-.5 3"/>
                          <path d="M2.83 16a10 10 0 0 0 2.43 3.4"/>
                          <path d="M4.636 5.235a10 10 0 0 1 .891-.857"/>
                          <path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/>
                        </svg>
                      </button>
                    )}
                    
                    {/* Silme Butonu */}
                    {payments.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePayment(index);
                        }}
                        className="payment-action-btn remove-btn"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          fontSize: '14px',
                          lineHeight: '1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '300',
                          transition: 'all 0.2s ease',
                          boxShadow: 'none'
                        }}
                        onMouseEnter={(e) => {
                          const button = e.currentTarget;
                          button.style.background = '#dc2626';
                          button.style.color = '#ffffff';
                          button.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          const button = e.currentTarget;
                          button.style.background = '#fee2e2';
                          button.style.color = '#dc2626';
                          button.style.boxShadow = 'none';
                        }}
                        title="Ödemeyi Sil"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          <line x1="10" x2="10" y1="11" y2="17"/>
                          <line x1="14" x2="14" y1="11" y2="17"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Full Görünüm */}
              {payment.isExpanded && (
                <div style={{ padding: '6px 40px 6px 6px' }}>
                  {/* Header kaldırıldı - Ödeme numaraları gösterilmiyor */}

                  {/* Form Fields - Ana form tasarımı ile aynı */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Ödeme Tipi */}
                    <div className="w-full flex flex-col gap-0 mb-0">
                      <label className="font-semibold text-[11px] text-[#003057] mb-0.5">Ödeme Tipi</label>
                      <select
                        required
                        className={`input-filled outline-none`}
                        value={payment.type}
                        onChange={(e) => updatePayment(index, 'type', e.target.value)}
                        style={{
                        backgroundColor: '#F4FCFB',
                        border: '1px solid #ACBCBF',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        width: '100%',
                        height: '28px',
                        lineHeight: '1.2',
                        boxSizing: 'border-box',
                        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg viewBox='0 0 4 5' xmlns='http://www.w3.org/2000/svg'><path d='m0 1 2 2 2-2' stroke='%23666' fill='none'/></svg>")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 6px center',
                        backgroundSize: '10px',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                        }}
                      >
                        {Object.entries(PaymentTypeLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tutar ve Para Birimi - Aynı Satırda */}
                    <div className="flex items-end gap-2 mb-0">
                      {/* Tutar */}
                      <div className="flex-1">
                        <div className="w-full flex flex-col gap-0 mb-0">
                          <label className="font-semibold text-[11px] text-[#003057] mb-0.5">Tutar</label>
                          <input
                            required
                            className="input-filled outline-none"
                            style={{
                              backgroundColor: '#F4FCFB',
                              border: '1px solid #ACBCBF',
                              boxShadow: 'none',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              paddingRight: '8px',
                              fontSize: '12px',
                              width: '100%',
                              height: '28px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box'
                            }}
                            type="text"
                            placeholder="Tutar"
                            value={payment.amount}
                            data-has-value={payment.amount ? "true" : "false"}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^\d]/g, '');
                              updatePayment(index, 'amount', numericValue);
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Para Birimi Radio Buttons */}
                      <div className="flex flex-col gap-0 mb-0">
                        <label className="font-semibold text-[11px] text-[#003057] mb-0.5">Para Birimi</label>
                        <div className="flex gap-1 items-center justify-center" style={{ height: '28px' }}>
                          {Object.entries(CurrencySymbols).map(([key, symbol]) => {
                            const isSelected = payment.currency === key;
                            return (
                              <label key={key} className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`currency-${index}`}
                                  value={key}
                                  checked={isSelected}
                                  onChange={() => updatePayment(index, 'currency', key)}
                                  className="sr-only"
                                />
                                <span
                                  className={`flex items-center justify-center text-[10px] font-bold rounded border transition-all ${
                                    isSelected
                                      ? 'text-[#003057] border-[#003057] shadow-sm'
                                      : 'text-[#003057] border-gray-400 hover:border-[#003057]'
                                  }`}
                                  style={{ width: '24px', height: '24px', backgroundColor: '#F4FCFB', border: isSelected ? '2px solid #003057' : '1px solid #ACBCBF', boxShadow: 'none' }}
                                >
                                  {symbol}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Tarih */}
                    <div className="w-full flex flex-col gap-0 mb-0">
                      <label className="font-semibold text-[11px] text-[#003057] mb-0.5">Tarih</label>
                      <input
                        required
                        className="input-filled outline-none"
                        style={{
                        backgroundColor: '#F4FCFB',
                        border: '1px solid #ACBCBF',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        width: '100%',
                        height: '28px',
                        lineHeight: '1.2',
                        boxSizing: 'border-box'
                        }}
                        type="date"
                        value={payment.date ? (() => {
                          try {
                            const parts = payment.date.split('.');
                            if (parts.length === 3) {
                              const day = parts[0].padStart(2, '0');
                              const month = parts[1].padStart(2, '0');
                              const year = parts[2];
                              return `${year}-${month}-${day}`;
                            }
                            return '';
                          } catch {
                            return '';
                          }
                        })() : ''}
                        data-has-value={payment.date ? "true" : "false"}
                        onChange={(e) => {
                          const htmlDate = e.target.value;
                          if (htmlDate) {
                            const parts = htmlDate.split('-');
                            const turkishDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
                            updatePayment(index, 'date', turkishDate);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Toplam Tutar Kartı */}
          {Object.keys(totalAmountsByCurrency).length > 0 && (
            <div
              className="total-card card-style"
              style={{
                padding: '6px',
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: totalCardExpanded ? 'default' : 'pointer',
                minHeight: totalCardExpanded ? 'auto' : '38px',
                borderRadius: '8px',
                margin: '0',
                backgroundColor: '#F4FCFB',
                border: '2px solid #10b981',
                boxShadow: 'none',
                marginTop: '12px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!totalCardExpanded) {
                  setTotalCardExpanded(true);
                }
              }}
            >
              {/* Minimize Edilmiş Görünüm */}
              {!totalCardExpanded && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 6px',
                  width: '100%'
                }}>
                  {/* Toplam Tutar Başlığı - Solda */}
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#10b981',
                    flex: '0 0 100px',
                    textAlign: 'left'
                  }}>
                    TOPLAM TUTAR
                  </div>
                  
                  {/* Toplam Tutarlar - Ortada */}
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#10b981',
                    flex: '1',
                    textAlign: 'center',
                    paddingLeft: '10px',
                    paddingRight: '10px'
                  }}>
                    {Object.entries(totalAmountsByCurrency).length === 1 ? (
                      // Tek para birimi varsa
                      Object.entries(totalAmountsByCurrency).map(([currency, amount]) => (
                        <span key={currency}>
                          {amount.toLocaleString('tr-TR')} {CurrencySymbols[currency]}
                        </span>
                      ))
                    ) : (
                      // Birden fazla para birimi varsa
                      <span>Detaylar için tıklayın</span>
                    )}
                  </div>
                  
                  {/* Boş alan - Sağda */}
                  <div style={{
                    flex: '0 0 50px'
                  }}>
                  </div>
                </div>
              )}

              {/* Full Görünüm */}
              {totalCardExpanded && (
                <div style={{ padding: '10px' }}>
                  {/* Başlık */}
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}>
                    TOPLAM TUTAR DETAYLARI
                  </div>

                  {/* Para Birimi Detayları */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Object.entries(totalAmountsByCurrency).map(([currency, amount]) => (
                      <div
                        key={currency}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '6px 12px',
                          backgroundColor: '#e6f7ed',
                          borderRadius: '6px',
                          border: '1px solid #10b981'
                        }}
                      >
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#065f46'
                        }}>
                          {currency === CurrencyTypes.TL ? 'Türk Lirası' :
                           currency === CurrencyTypes.USD ? 'Amerikan Doları' :
                           currency === CurrencyTypes.EUR ? 'Euro' :
                           currency === CurrencyTypes.GBP ? 'İngiliz Sterlini' :
                           currency === CurrencyTypes.CHF ? 'İsviçre Frangı' : currency}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#10b981'
                        }}>
                          {amount.toLocaleString('tr-TR')} {CurrencySymbols[currency]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Kapatma için tıkla notu */}
                  <div style={{
                    fontSize: '9px',
                    color: '#6b7280',
                    textAlign: 'center',
                    marginTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    Kapatmak için dışarı tıklayın
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
