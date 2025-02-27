
import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-navy text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-playfair mb-6">Terms of Use</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Guidelines for using our website and services.
          </p>
        </div>
      </section>
      
      {/* Terms Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2 className="text-navy font-playfair text-2xl mt-10 mb-4">Terms and Conditions</h2>
            <p>
              Welcome to Fraterny, accessible at https://fraterny.com. By accessing or using our website, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, please do not use our website.
            </p>
            <p>
              These Terms and Conditions govern your use of this website, https://fraterny.com (the "Website"), Fraterny ("Business Name") offer of services for purchase on this Website, or your purchase of services available on this Website. This Agreement includes, and incorporates by this reference, the policies and guidelines referenced below. Fraterny reserves the right to change or revise the terms and conditions of this Agreement at any time by posting any changes or a revised Agreement on this Website. Fraterny will alert you that changes or revisions have been made by indicating on the top of this Agreement the date it was last revised. The changed or revised Agreement will be effective immediately after it is posted on this Website. Your use of the Website following the posting of any such changes or of a revised Agreement will constitute your acceptance of any such changes or revisions. Fraterny encourages you to review this Agreement whenever you visit the Website to make sure that you understand the terms and conditions governing use of the Website. This Agreement does not alter in any way the terms or conditions of any other written agreement you may have with Fraterny for other products or services. If you do not agree to this Agreement (including any referenced policies or guidelines), please immediately terminate your use of the Website.
            </p>
            
            <h3 className="text-navy font-playfair text-xl mt-8 mb-4">Use and Purpose of Website</h3>
            <ol className="list-decimal mb-8 pl-5">
              <li className="mb-4">
                The website is intended for commercial use and is a platform on which the brand interacts with its audience. The audience forms the user base and avail services at their own will on the website. Users must not use the website for unlawful or prohibited purposes.
              </li>
              <li className="mb-4">
                The content and services provided on the website are related to the project/Brand the website is operating for and is subject to change without notice, time to time. You will not use the Website for illegal purposes. By using the website you agree you will (1) abide by all applicable local, state, national, and international laws and regulations in your use of the Website (including laws regarding intellectual property), (2) not interfere with or disrupt the use and enjoyment of the Website by other users, (3) not resell material on the Website, (4) not engage, directly or indirectly, in transmission of "spam", chain letters, junk mail or any other type of unsolicited communication, and (5) not defame, harass, abuse, or disrupt other users of the Website.
              </li>
              <li className="mb-4">
                By using this Website, you are granted a limited, non-exclusive, non-transferable right to use the content and materials on the Website in connection with your normal, noncommercial, use of the Website. You may not copy, reproduce, transmit, distribute, or create derivative works of such content or information without express written authorization from Fraterny or the applicable third party (if third-party content is at issue).
              </li>
            </ol>
            
            <h3 className="text-navy font-playfair text-xl mt-8 mb-4">Intellectual Property</h3>
            <ol className="list-decimal mb-8 pl-5">
              <li className="mb-2">
                The website and its original content, features, and functionality are owned by Fraterny and are protected by copyright and intellectual property laws.
              </li>
              <li className="mb-2">
                Users are granted a limited license to access and use the website and its content.
              </li>
              <li className="mb-2">
                Users agree not to copy or intend to copy the material, content or pictures on the website.
              </li>
            </ol>
            
            <h3 className="text-navy font-playfair text-xl mt-8 mb-4">Liability Limitations</h3>
            <ol className="list-decimal mb-8 pl-5">
              <li className="mb-2">
                Fraterny is not liable for any indirect, incidental, special, or consequential damages arising from the use of the website.
              </li>
              <li className="mb-2">
                The website is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind.
              </li>
              <li className="mb-2">
                You will release, indemnify, defend and hold harmless Fraterny and any of its contractors, agents, employees, officers, directors, shareholders, affiliates and assigns from all liabilities, claims, damages, costs and expenses, including reasonable attorneys' fees and expenses, of third parties relating to or arising out of (1) this Agreement or the breach of your warranties, representations and obligations under this Agreement; (2) the Website content or your use of the Website content; (3) the Services or your use of the Services (4) any intellectual property or other proprietary right of any person or entity; (5) your violation of any provision of this Agreement; or (6) any information or data you supplied to Fraterny. When Fraterny is threatened with suit or sued by a third party, Fraterny may seek written assurances from you concerning your promise to indemnify Fraterny; your failure to provide such assurances may be considered by Fraterny to be a material breach of this Agreement. Fraterny will have the right to participate in any defence by you of a third-party claim related to your use of any of the Website content or Products, with counsel of Fraterny choice at its expense. Fraterny will reasonably cooperate in any defence by you of a third-party claim at your request and expense. You will have sole responsibility to defend Fraterny against any claim, but you must receive Fraterny prior written consent regarding any related settlement. The terms of this provision will survive any termination or cancellation of this Agreement or your use of the Website or Products.
              </li>
            </ol>
            
            <h3 className="text-navy font-playfair text-xl mt-8 mb-4">Termination of Use</h3>
            <p>
              Fraterny reserves the right to terminate or suspend access to the website for any user who violates these Terms.
            </p>
            
            <h3 className="text-navy font-playfair text-xl mt-8 mb-4">Governing Law and Dispute Resolution</h3>
            <p>
              These Terms shall be governed by the laws of India. Any disputes arising from these Terms will be resolved through arbitration in accordance with the Arbitration and Conciliation Act, 1996. You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to the use of the Website or Products or this Agreement must be filed within one (1) year after such claim or cause of action arose or be forever barred.
            </p>
            
            <h3 className="text-navy font-playfair text-xl mt-8 mb-4">Amendments</h3>
            <p>
              Fraterny reserves the right to modify these Terms at any time. The most current version of these Terms will govern the use of the website.
            </p>
            
            <h3 className="text-navy font-playfair text-xl mt-8 mb-4">Contact Information</h3>
            <p>
              For any questions or concerns regarding these Terms, please contact us at support@fraterny.com
            </p>
            
            <p className="text-sm text-gray-500 mt-12 italic">
              Last updated: February 2025
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
