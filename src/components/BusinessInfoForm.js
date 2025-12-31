import React from 'react';

const BusinessInfoForm = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="bg-green-800 text-white py-6 text-center">
        <h1 className="text-3xl font-bold">Biomed Recovery & Disposal Ltd.</h1>
        <p className="text-lg mt-2">Leading Waste Management Services Across Saskatchewan</p>
      </header>

      {/* Navigation */}
      <nav className="bg-green-900 text-white flex flex-wrap justify-center gap-6 py-3 text-sm md:text-base">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">About Us</a>
        <a href="#" className="hover:underline">Services</a>
        <a href="#" className="hover:underline">Contact</a>
      </nav>

      {/* Hero */}
      <section className="bg-cover bg-center h-64 flex items-center justify-center text-white text-2xl md:text-4xl font-bold shadow-md" style={{ backgroundImage: `url('/your-hero-image.jpg')` }}>
        Your Trusted Biohazard Waste Partner
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: 'Sharps Disposal',
              description: 'Safe and compliant pickup of all sharps waste.',
              icon: '/icons/sharps.png'
            },
            {
              title: 'Medical Waste',
              description: 'Reliable removal and disposal of medical waste.',
              icon: '/icons/medical.png'
            },
            {
              title: 'Pharmaceutical',
              description: 'Secure and discreet handling of pharmaceuticals.',
              icon: '/icons/pharma.png'
            }
          ].map((service, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <img src={service.icon} alt={service.title} className="mx-auto w-16 h-16 mb-4"/>
              <h3 className="text-xl font-semibold text-green-800 mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white text-center py-6 mt-10">
        <p>© 2025 Biomed Recovery & Disposal Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BusinessInfoForm;
