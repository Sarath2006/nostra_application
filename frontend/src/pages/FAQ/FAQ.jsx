import React, { useState } from 'react'
import './FAQ.css'

const FAQ = () => {
  const [openFAQId, setOpenFAQId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQId(openFAQId === id ? null : id);
  };

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "Browse our collections, choose your preferred size and color, add the item to your cart, and complete checkout by entering your delivery details and payment information."
    },
    {
      id: 2,
      question: "How long does delivery take?",
      answer: "Orders are usually delivered within 3–7 business days, depending on your location and product availability. Delivery timelines may vary for remote areas."
    },
    {
      id: 3,
      question: "What is your return and exchange policy?",
      answer: "We offer a 7-day easy return or exchange from the date of delivery. Products must be unused, unwashed, and returned with original tags intact."
    },
    {
      id: 4,
      question: "What payment methods are accepted?",
      answer: "We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery (COD) for eligible locations. All payments are processed securely."
    },
    {
      id: 5,
      question: "How do I choose the right size?",
      answer: "Each product page includes a detailed size chart. We recommend checking the measurements carefully before placing your order to ensure the best fit."
    },
    {
      id: 6,
      question: "What is the Recycle / ReWear program?",
      answer: "Our ReWear program allows you to recycle your old or unused clothes responsibly. By recycling, you help reduce textile waste and earn rewards for your contribution to sustainability."
    },
    {
      id: 7,
      question: "What items can I recycle through ReWear?",
      answer: "You can recycle clean and used clothing such as tops, jeans, dresses, and other wearable fabrics. Damaged or heavily soiled items may not be accepted."
    },
    {
      id: 8,
      question: "How does the recycling pickup process work?",
      answer: "After submitting a recycle request, you can schedule a pickup at your address. Our logistics partner will collect the items from your doorstep on the selected date."
    },
    {
      id: 9,
      question: "Do I get rewards for recycling clothes?",
      answer: "Yes, once your recycled items are verified, you will receive reward points or store credits that can be used for future purchases on our website."
    },
    {
      id: 10,
      question: "Why should I recycle clothes with your platform?",
      answer: "Recycling helps reduce landfill waste, saves natural resources, and supports sustainable fashion. By recycling with us, you actively contribute to a cleaner and greener future."
    }
  ];

  return (
    <div className="faq-page-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our products, services, and policies</p>
      </div>

      <div className="faq-content">
        <div className="faq-categories">
          <div className="faq-category">
            <h2>Shopping & Orders</h2>
            <div className="faq-list">
              {faqs.slice(0, 5).map((faq) => (
                <div key={faq.id} className={`faq-item ${openFAQId === faq.id ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                    <span>{faq.question}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="faq-category">
            <h2>Recycling & ReWear</h2>
            <div className="faq-list">
              {faqs.slice(5, 10).map((faq) => (
                <div key={faq.id} className={`faq-item ${openFAQId === faq.id ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                    <span>{faq.question}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="faq-sidebar">
          <div className="faq-support-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Still have questions?</h3>
            <p>Can't find the answer you're looking for? Please chat with our support team.</p>
            <button className="btn-contact-support">Contact Support</button>
          </div>

          <div className="faq-info-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <h3>Need Help?</h3>
            <p>Our customer support team is available 24/7 to assist you with any questions or concerns.</p>
            <p className="contact-info">Email: support@nostalgia.com<br/>Phone: +1 (800) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
