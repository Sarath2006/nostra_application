import React, { useState } from "react";
import "./Contact.css";
import { FaFacebookF, FaYoutube } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { StoreContext } from "../../context/StoreContext";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const Contact = () => {
  const { backendUrl, token } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/contact/send`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-container">
      {/* Left Section */}
      <div className="contact-info">
        <h4>/ get in touch /</h4>
        <h2>We are always ready to help you and answer your questions</h2>
        <p>
          Discover trendy, timeless, and comfortable fashion that lets you express your unique style with confidence.
        </p>

        <div className="info-grid">
          <div>
            <h3>Call Center</h3>
            <p>800 100 915 20 34</p>
            <p>+ (1) 123-456-7890</p>
          </div>
          <div>
            <h3>Our Location</h3>
            <p>Sidney, USA – Ohio 45365</p>
            <p>Str. First, Avenue 1</p>
          </div>
          <div>
            <h3>Email</h3>
            <p>nostra@gmail.com</p>
          </div>
          <div>
            <h3>Social Network</h3>
            <div className="social-links">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><BsTwitterX /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="https://www.youtube.com/@flipkart"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="contact-form">
        <h3>Get in Touch</h3>
        <p>
          Define your goals and identify areas where AI can add value to your
          business
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          />
          <button type="submit" disabled={loading}>
            ➤ {loading ? 'Sending...' : 'Send a message'}
          </button>        </form>
      </div>

      {/* Map Section */}
      <div className="contact-map">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46350.893533681716!2d-84.20721457072261!3d40.2855072195891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883f0c91c684f83f%3A0x62882da53b8e6cc!2sSidney%2C%20OH%2045365%2C%20USA!5e1!3m2!1sen!2sin!4v1766939187587!5m2!1sen!2sin"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
      </div>


    </section>
  )
}

export default Contact
