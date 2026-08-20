import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-4xl mx-auto space-y-12 font-body text-[#2A1B17]">
      
      {/* Page Header */}
      <div className="text-center space-y-4 border-b border-[#E8DED2] pb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          THE COFFEE BEAN &amp; TEA LEAF PAKISTAN
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#351B38]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#6B4A3A]">
          Last Updated: 2026 | Owned and Operated by Ab Brands Pvt Ltd
        </p>
      </div>

      {/* Main Policy Content Sections */}
      <div className="space-y-10 text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
        
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#351B38]">Information We Collect</h2>
          <p className="text-[#2A1B17]">
            We collect information you provide directly to us, information collected automatically when you access or use our Services, and information collected from third-party sources.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-base text-[#351B38]">Information You Provide to Us</h3>
          <p>
            We collect information when you create an account, participate in any interactive features of the Services, fill out a form, request customer support, place an order, or otherwise communicate with us. The types of information we may collect include your name, email address, postal address, phone number, payment method information, and any other information you choose to provide.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-base text-[#351B38]">Information We Collect Automatically When You Use the Services</h3>
          <p>
            When you access or use our Services, we automatically collect information about you, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Transaction Information:</strong> When you purchase a product or order online, we collect information about the transaction, such as product details, purchase price, and date and location of the transaction.</li>
            <li><strong>Log Information:</strong> We log information about your use of the Services, including the type of browser you use, access times, pages viewed, your IP address, and the page you visited before navigating to our Services.</li>
            <li><strong>Device Information:</strong> We collect information about the computer or mobile device you use to access our Services, including the hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
            <li><strong>Location Information:</strong> We may collect information about the precise or approximate location of your device when you consent to the collection of this information to help you locate nearby stores.</li>
            <li><strong>Information Collected by Cookies and Other Tracking Technologies:</strong> We use various technologies to collect information, including cookies and web beacons, to maintain session preferences and analyze trends.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#351B38]">Use of Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our Services, such as to process transactions, develop new products and services, personalize your online experience, and communicate with you about products, services, offers, promotions, and events.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#351B38]">Security of Your Information</h2>
          <p>
            We take reasonable administrative, technical, and physical measures to protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#351B38]">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@coffeebean.pk" className="text-[#4B274F] font-semibold hover:underline">info@coffeebean.pk</a> or call <span className="font-mono text-[#2A1B17]">0302 5455448</span>.
          </p>
        </section>

      </div>

    </div>
  );
}
