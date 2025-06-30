/**
 * Ana Teslim Tutanağı Form Bileşeni - Refactored Version
 * Bu dosya, uygulamanın kalbi olan ana form bileşenini içerir
 *
 * REFACTOR NOTES:
 * - State management hook'lara taşındı
 * - Component'ler modular hale getirildi
 * - Theme management centralized edildi
 * - Single Responsibility Principle uygulandı
 */

import { Printer, Edit, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from 'react';

import ErrorBoundary from './components/ErrorBoundary';

// Büyük component'ler için lazy loading ekle
const TutanakTemplate = lazy(() => import('./components/TutanakTemplate'));

// Ana form component'leri eagerly load - ilk render'da gerekli
import BrandSelector from './components/RolexWatchForm/MainForm/BrandSelector';
import CustomerForm from './components/RolexWatchForm/MainForm/CustomerForm';
import RmcInput from './components/RolexWatchForm/MainForm/RmcInput';
import ProductDetailModal from './components/ProductModal/ProductDetailModal';
import PaymentDetailModal from './components/ProductModal/PaymentDetailModal';
import {
  BrandTypes,
  CategoryTypes,
  PaymentTypes,
  CurrencyTypes,
} from './constants/types';
import { THEME } from './constants/theme';
import { useFormData } from './hooks/useFormData';
import { usePayments } from './hooks/usePayments';
import { useRmcAnalysis } from './hooks/useRmcAnalysis';
// import { useTheme } from './hooks/useTheme';
import { getCurrentDate } from './utils/dateHelpers';
import { validateForm } from './utils/formValidation';
import { generatePaymentDetailsText } from './utils/paymentHelpers';
import { generateId } from './utils/stringHelpers';

// Form için başlangıç değerleri - static object, component dışında tanımlanır
const initialFormData = {
  musteri: '',
  rmc: '',
  seri: '',
  size: '',
  aile: '',
  description: '',
  teslimEdilenKisi: '',
  kadran: '',
  bilezik: '',
  fiyat: ''
};

const RolexWatchForm = () => {

  // Ana state'ler - Minimal state management
  const [currentDate] = useState(() => getCurrentDate());
  const [selectedBrand, setSelectedBrand] = useState(BrandTypes.ROLEX);
  const [selectedCategory, setSelectedCategory] = useState(CategoryTypes.SAAT);
  const [showResult, setShowResult] = useState(false);
  const [paymentDetailsText, setPaymentDetailsText] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [rmcAnalysisResult, setRmcAnalysisResult] = useState(null);
  const [rmcMessage, setRmcMessage] = useState({ text: '', type: '' });
  const [isProductChecked, setIsProductChecked] = useState(false);

  // Ödeme verileri için state'ler
  const [currentPayments, setCurrentPayments] = useState([]);
  const [isPaymentFormValid, setIsPaymentFormValid] = useState(false);
  const [currentTotalText, setCurrentTotalText] = useState('');

  // Custom hooks
  // const { brandColor, activeBorderColor } = useTheme(selectedBrand, selectedCategory);

  const {
    formData,
    setFormData,
    handleChange,
  } = useFormData(initialFormData, selectedBrand);

  const {
    payments,
    setPayments,
    totalAmount,
    totalAmountsByCurrency,
  } = usePayments(currentDate);

  const {
    isLoadingRmc,
    analyzeRmc
  } = useRmcAnalysis(selectedBrand, selectedCategory, setRmcMessage, setRmcAnalysisResult);

  // Computed values
  const isRmcValid = useMemo(() => {
    return formData.rmc &&
           rmcAnalysisResult &&
           rmcMessage.type !== 'error';
  }, [formData.rmc, rmcAnalysisResult, rmcMessage.type]);

  // Form validasyonu - tüm alanların dolu olup olmadığını kontrol et
  const isFormValid = useMemo(() => {
    return validateForm(
      formData,
      selectedBrand,
      selectedCategory,
      isProductChecked,
      rmcAnalysisResult,
      rmcMessage
    );
  }, [formData, selectedBrand, selectedCategory, isProductChecked, rmcAnalysisResult, rmcMessage]);

  // Event handlers
  const handleRmcChange = useCallback(async (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, rmc: value }));
    setRmcAnalysisResult(null);
    setRmcMessage({ text: '', type: '' });
    setIsProductChecked(false);

    if (!value || !value.trim()) return;

    const analysisResult = await analyzeRmc(value);
    setFormData(prev => ({ ...prev, ...analysisResult }));
  }, [analyzeRmc, setFormData]);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrand(brand);
    setSelectedCategory(CategoryTypes.SAAT);
    setFormData(initialFormData);
    setRmcMessage({ text: '', type: '' });
    setRmcAnalysisResult(null);
    setIsProductChecked(false);
  }, [setFormData, initialFormData]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setFormData(initialFormData);
    setRmcMessage({ text: '', type: '' });
    setRmcAnalysisResult(null);
    setIsProductChecked(false);
  }, [setFormData, initialFormData]);

  const handleProductCheckChange = useCallback((checked) => {
    setIsProductChecked(checked);
  }, []);

  // Ödeme verilerini güncelleme handler'ı
  const handlePaymentsChange = useCallback((payments, isValid, totalText) => {
    setCurrentPayments(payments);
    setIsPaymentFormValid(isValid);
    setCurrentTotalText(totalText);
  }, []);

  // Submit handler'ı
  const handleSubmit = useCallback(() => {
    if (!isProductChecked) {
      alert('Ürün kontrolü yapıldığına dair onay vermelisiniz!');
      return;
    }

    const validPayments = currentPayments.filter(payment =>
      payment.amount && parseFloat(payment.amount) > 0
    );

    if (validPayments.length > 0) {
      setPayments(validPayments);
      setShowResult(true);
      window.scrollTo(0, 0);
    } else {
      alert('En az bir ödeme eklemelisiniz!');
    }
  }, [isProductChecked, currentPayments, setPayments]);

  const handleNewForm = useCallback(() => {
    setShowResult(false);
    setFormData(initialFormData);
    setSelectedBrand(BrandTypes.ROLEX);
    setSelectedCategory(CategoryTypes.SAAT);
    setRmcMessage({ text: '', type: '' });
    setRmcAnalysisResult(null);
    setIsProductChecked(false);
    setValidationErrors({});
    setPayments([{
      id: generateId(),
      type: PaymentTypes.HAVALE,
      date: currentDate,
      amount: '',
      currency: CurrencyTypes.TL
    }]);
    window.scrollTo(0, 0);
  }, [setFormData, setPayments, currentDate, initialFormData]);

  const handleEdit = useCallback(() => {
    setShowResult(false);
    setRmcMessage({ text: '', type: '' });
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Set mint green background on body via CSS
  useEffect(() => {
    document.body.style.minHeight = '100vh';
    // Background color now handled by CSS (mint green 50)
    
    return () => {
      // Cleanup when component unmounts
      document.body.style.minHeight = '';
    };
  }, []);

  // Effects - Payment details generation
  useEffect(() => {
    if (payments.length > 0) {
      const details = generatePaymentDetailsText(payments, formData, selectedBrand, selectedCategory);
      setPaymentDetailsText(details);
    } else {
      setPaymentDetailsText('');
    }
  }, [payments, formData, selectedBrand, selectedCategory]);

  // Tutanak görünümü
  if (showResult) {
    return (
      <div className="min-h-screen print:shadow-none print:border-none" style={THEME.formContainer.printView}>
        <div className="max-w-4xl mx-auto p-4 print:p-0 print:m-0" style={THEME.formContainer.printView}>
          <div className="print:rounded-none print:shadow-none" style={THEME.formContainer.printView}>
            <Suspense fallback={<div className="flex items-center justify-center h-96"><div className="text-gray-500">Tutanak yükleniyor...</div></div>}>
              <TutanakTemplate
                formData={formData}
                selectedBrand={selectedBrand}
                selectedCategory={selectedCategory}
                payments={payments}
                currentDate={currentDate}
                totalAmount={totalAmount}
                totalAmountsByCurrency={totalAmountsByCurrency}
                paymentDetailsText={paymentDetailsText}
                rmcAnalysisResult={rmcAnalysisResult}
              />
            </Suspense>
            {/* Icon buttons positioned on the right side */}
            <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 print:hidden">
              <button
                onClick={handleEdit}
                className="tutanak-action-btn p-2 hover:opacity-70 focus:outline-none transition-opacity duration-200"
                title="Düzenle"
              >
                <Edit size={24} strokeWidth={1.5} style={THEME.icons.edit} />
              </button>
              <button
                onClick={handlePrint}
                className="tutanak-action-btn p-2 hover:opacity-70 focus:outline-none transition-opacity duration-200"
                title="Yazdır"
              >
                <Printer size={24} strokeWidth={1.5} style={THEME.icons.print} />
              </button>
              <button
                onClick={handleNewForm}
                className="tutanak-action-btn p-2 hover:opacity-70 focus:outline-none transition-opacity duration-200"
                title="Yeni Tutanak"
              >
                <Trash2 size={24} strokeWidth={1.5} stroke={THEME.icons.delete.stroke} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ana form render'ı
  return (
    <div className="modal-container" style={THEME.formContainer.main}>
      {/* ANA BİLGİ MODALI */}
      <div className="modal main-modal">
        <div className="form" style={THEME.formContainer.content}>

          {/* MARKA SEÇİMİ */}
          <BrandSelector
            selectedBrand={selectedBrand}
            selectedCategory={selectedCategory}
            onBrandChange={handleBrandChange}
            onCategoryChange={handleCategoryChange}
          />

          <div className="credit-card-info--form">
            {/* MÜŞTERİ BİLGİLERİ */}
            <CustomerForm
              formData={formData}
              validationErrors={validationErrors}
              onChange={handleChange}
            />

            {/* RMC VE ÜRÜN BİLGİLERİ */}
            <RmcInput
              formData={formData}
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              validationErrors={validationErrors}
              rmcAnalysisResult={rmcAnalysisResult}
              rmcMessage={rmcMessage}
              isProductChecked={isProductChecked}
              isRmcValid={isRmcValid}
              onRmcChange={handleRmcChange}
              onChange={handleChange}
              onProductCheckChange={handleProductCheckChange}
            />
          </div>
        </div>
      </div>

      {/* ÜRÜN DETAY MODALI */}
      <div className="modal second-modal">
        <ErrorBoundary>
          <ProductDetailModal
            formData={formData}
            selectedBrand={selectedBrand}
            selectedCategory={selectedCategory}
            rmcAnalysisResult={rmcAnalysisResult}
            rmcMessage={rmcMessage}
            isProductChecked={isProductChecked}
            isLoadingRmc={isLoadingRmc}
          />
        </ErrorBoundary>
      </div>

      {/* ÖDEME DETAY MODALI */}
      {isFormValid && (
        <div className="modal third-modal">
          <ErrorBoundary>
            <PaymentDetailModal
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              currentDate={currentDate}
              isProductChecked={isProductChecked}
              payments={payments}
              onPaymentsChange={handlePaymentsChange}
            />
          </ErrorBoundary>
        </div>
      )}

      {/* GÖNDER VE TEMİZLE BUTONLARI - YENİ TAİLWİND TASARIM */}
      <div className="submit-button-group">
        {/* Gönder Butonu - Sadece Validasyon Sağlandığında */}
        {isFormValid && isPaymentFormValid && (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            title="Formu Gönder"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Gönder
          </button>
        )}

        {/* Temizle Butonu - Her Zaman Aktif */}
        <button
          className="clear-btn"
          onClick={handleNewForm}
          title="Formu Temizle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 22-1-4"/>
            <path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1"/>
            <path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z"/>
            <path d="m8 22 1-4"/>
          </svg>
          Temizle
        </button>
      </div>
    </div>
  );
};

export default RolexWatchForm;
