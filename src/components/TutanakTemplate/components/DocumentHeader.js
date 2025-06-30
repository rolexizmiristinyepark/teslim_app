/**
 * DocumentHeader Component
 * Renders the header section with logos, date, and title
 */

// No React import needed for JSX-only component

const DocumentHeader = ({ currentDate }) => {
  return (
    <>
      {/* Logo Section */}
      <div className="logo-container flex justify-between items-center mb-2.5 py-1.5">
        <img src="/images/rolex.png" alt="Rolex" className="h-11 w-auto" />
        <img src="/images/kulahcioglu.png" alt="Külahçıoğlu" className="h-11 w-auto" />
        <img src="/images/tudor.png" alt="Tudor" className="h-11 w-auto" />
      </div>

      <br />

      {/* Date - right aligned */}
      <p className="text-right my-2">İZMİR - {currentDate}</p>

      <br />

      {/* Title - centered */}
      <h1 className="text-center font-bold text-lg my-3">TESLİM TUTANAK</h1>

      <br />
    </>
  );
};

export default DocumentHeader;