import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-4xl mx-auto space-y-12 font-body text-[#1C1714]">
      
      {/* Page Header */}
      <div className="text-center space-y-4 border-b border-[#EDE4D8] pb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          THE COFFEE BEAN &amp; TEA LEAF PAKISTAN
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#24150F]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#756A62]">
          Last Updated: 2026 | Owned and Operated by Ab Brands Pvt Ltd
        </p>
      </div>

      {/* Main Policy Content Sections */}
      <div className="space-y-10 text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
        
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#24150F]">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, information collected automatically when you access or use our Services, and information collected from third-party sources.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-base text-[#24150F]">Information You Provide to Us</h3>
          <p>
            We collect information when you create an account, participate in any interactive features of the Services, fill out a form, request customer support, place an order, or otherwise communicate with us. The types of information we may collect include your name, email address, postal address, phone number, payment method information, and any other information you choose to provide.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-base text-[#24150F]">Information We Collect Automatically When You Use the Services</h3>
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
          <h3 className="font-semibold text-base text-[#24150F]">Information We Collect From Other Sources</h3>
          <p>
            We may also obtain information from other sources and combine that with information we collect through our Services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#24150F]">Use of Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our Services, process transactions, send related information including confirmations and receipts, respond to your comments, questions, and requests, communicate about products, services, offers, promotions, and events, and personalize your experience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#24150F]">Information We Share</h2>
          <p>
            We may share information about you with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf, in response to a request for information if we believe disclosure is in accordance with applicable law, or with your consent or at your direction.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-base text-[#24150F]">Social Sharing</h3>
          <p>
            The Services may offer social sharing features and other integrated tools (such as Facebook or Instagram links) which let you share actions you take on our Services with other media.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-base text-[#24150F]">Advertising and Analytics Services Provided by Others</h3>
          <p>
            We may allow others to provide analytics services and serve advertisements on our behalf across the internet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#24150F]">Your Choices</h2>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-[#24150F]">Changing Your Information</h4>
            <p>You may update or correct account information at any time by logging into your online account.</p>
            <h4 className="font-semibold text-sm text-[#24150F]">Receiving Promotional Communication</h4>
            <p>You may opt out of receiving promotional emails by following the instructions in those emails.</p>
            <h4 className="font-semibold text-sm text-[#24150F]">Tracking Technologies</h4>
            <p>Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies.</p>
            <h4 className="font-semibold text-sm text-[#24150F]">“Do Not Track” Technology</h4>
            <p>We do not currently take actions to respond to Do Not Track signals because a uniform technological standard has not yet been developed.</p>
            <h4 className="font-semibold text-sm text-[#24150F]">Account Information</h4>
            <p>If you wish to delete or deactivate your account, please contact us at info@coffeebean.pk.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-[#24150F]">Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#EDE4D8] pt-6">
          <h2 className="font-display text-2xl text-[#24150F]">Contacting Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="p-4 bg-[#EDE4D8]/60 rounded-xs space-y-1 font-mono text-xs text-[#24150F]">
            <p>The Coffee Bean &amp; Tea Leaf Pakistan</p>
            <p>Owned and Operated by Ab Brands Pvt Ltd</p>
            <p>Email: <a href="mailto:info@coffeebean.pk" className="text-[#B8895B] underline">info@coffeebean.pk</a></p>
            <p>Phone: <a href="tel:03025455448" className="text-[#B8895B] underline">0302 5455448</a></p>
          </div>
        </section>

      </div>

    </div>
  );
}
