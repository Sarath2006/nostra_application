import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteAccountModal from '../../components/DeleteAccountModal';


const Profile = () => {
  const { backendUrl, token, navigate, setToken, setCartItems } = useContext(StoreContext);
  const [activeSection, setActiveSection] = useState('personal');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletStats, setWalletStats] = useState({
    totalCoins: 0,
    totalCoinsEarned: 0,
    totalItems: 0,
    totalOrders: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Personal Info States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');

  // Contact Info States
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address States
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  });


  useEffect(() => {
    if (!token) {
      navigate('/login-or-signup');
      return;
    }
    fetchUserProfile();
    fetchWalletStats();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const user = response.data.user;
        setUserData(user);
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setDateOfBirth(user.dateOfBirth || '');
        setGender(user.gender || '');
        setCountry(user.country || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setAddresses(user.addresses || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletStats = async () => {
    try {
      const response = await axios.get(
        backendUrl + '/api/recycle/dashboard',
        { headers: { token } }
      );

      if (response.data.success && response.data.stats) {
        setWalletStats(response.data.stats);
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to load wallet stats');
    } finally {
      setWalletLoading(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/update-profile',
        { firstName, lastName, dateOfBirth, gender, country },
        { headers: { token } }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        toast.success('Personal information updated successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/update-profile',
        { phone },
        { headers: { token } }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        toast.success('Contact information updated successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // UI only - no backend implementation
    toast.info('Password change feature coming soon');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + '/api/user/add-address',
        addressForm,
        { headers: { token } }
      );

      if (response.data.success) {
        setAddresses(response.data.addresses);
        setShowAddressForm(false);
        setAddressForm({
          name: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: ''
        });
        toast.success('Address added successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/delete-address',
        { addressId },
        { headers: { token } }
      );

      if (response.data.success) {
        setAddresses(response.data.addresses);
        toast.success('Address deleted successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/user/delete-account',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Account deleted successfully');
        // Clear local storage and state
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken('');
        setCartItems({});
        // Close modal and redirect
        setShowDeleteModal(false);
        navigate('/login-or-signup');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeleteLoading(false);
    }
  };



  const handleLocationAddress = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const address = data.address || {};
        const newAddress = {
          name: 'Current Location',
          phone: '',
          street: address.road || '',
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          zipcode: address.postcode || '',
          country: address.country || '',
        };
        await fetch(`${backendUrl}/api/user/add-address`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', token },
          body: JSON.stringify(newAddress)
        });
        // Refetch address list
        fetchUserProfile();
      } catch (err) {
        alert('Failed to fetch address from location.');
      }
    }, () => {
      alert('Permission denied or location unavailable.');
    });
  };


  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <button
            className={`sidebar-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Profile
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate('/orders')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Order History
          </button>

          <button
            className={`sidebar-item ${activeSection === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveSection('wallet')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 12V7H5C3.89543 7 3 6.10457 3 5V5C3 3.89543 3.89543 3 5 3H19V7M21 12V17M21 12H5C3.89543 12 3 11.1046 3 10V10C3 8.89543 3.89543 8 5 8H21M21 17H5C3.89543 17 3 16.1046 3 15V15C3 13.8954 3.89543 13 5 13H21V17ZM21 17V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            My Wallet
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate('/faq')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            FAQs
          </button>

          <button
            className="sidebar-item sidebar-item-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete Account
          </button>

          <button
            className="sidebar-item sidebar-item-logout"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login-or-signup');
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Log out
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          <h1 className="profile-title">PERSONAL DATA</h1>
          <p className="profile-subtitle">Enter your personal data so that you do not have to fill it in manually when placing an order.</p>



          {/* Personal Info Section */}
          <div className="accordion-section">
            <button
              className={`accordion-header ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'personal' ? '' : 'personal')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Personal Info</span>
              <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {activeSection === 'personal' && (
              <div className="accordion-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name*</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Second Name*</label>
                    <input
                      type="text"
                      placeholder="Second Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Country*</label>
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => {
                    setFirstName(userData.firstName || '');
                    setLastName(userData.lastName || '');
                    setDateOfBirth(userData.dateOfBirth || '');
                    setGender(userData.gender || '');
                    setCountry(userData.country || '');
                  }}>Cancel</button>
                  <button className="btn-save" onClick={handleSavePersonalInfo}>Save Changes</button>
                </div>
              </div>
            )}
          </div>


          {/* Wallet Overview Section */}
          <div className="accordion-section">
            <button
              className={`accordion-header ${activeSection === 'wallet' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'wallet' ? '' : 'wallet')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 7C4 5.89543 4.89543 5 6 5H20C21.1046 5 22 5.89543 22 7V9C22 10.1046 21.1046 11 20 11H6C4.89543 11 4 10.1046 4 9V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 15C4 13.8954 4.89543 13 6 13H18C19.1046 13 20 13.8954 20 15V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>My Wallet</span>
              <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {activeSection === 'wallet' && (
              <div className="accordion-content">
                {walletLoading ? (
                  <div className="wallet-loading">Loading wallet...</div>
                ) : (
                  <>
                    <div className="wallet-stats-grid">
                      <div className="wallet-stat-card">
                        <p className="wallet-stat-label">Available Coins</p>
                        <h3 className="wallet-stat-value">{walletStats.totalCoins}</h3>
                        <p className="wallet-stat-sub">Spend coins for checkout discounts.</p>
                      </div>
                      <div className="wallet-stat-card">
                        <p className="wallet-stat-label">Lifetime Coins Earned</p>
                        <h3 className="wallet-stat-value">{walletStats.totalCoinsEarned}</h3>
                        <p className="wallet-stat-sub">Earn coins by recycling clothes.</p>
                      </div>
                      <div className="wallet-stat-card">
                        <p className="wallet-stat-label">Items Recycled</p>
                        <h3 className="wallet-stat-value">{walletStats.totalItems}</h3>
                        <p className="wallet-stat-sub">Total pieces sent for recycling.</p>
                      </div>
                      <div className="wallet-stat-card">
                        <p className="wallet-stat-label">Recycle Orders</p>
                        <h3 className="wallet-stat-value">{walletStats.totalOrders}</h3>
                        <p className="wallet-stat-sub">Completed recycling pickups.</p>
                      </div>
                    </div>
                    <div className="wallet-note">
                      <p>
                        Use these coins for discounts when buying products. Recycle your old clothes to earn more coins and reduce waste.
                      </p>
                      <button className="btn-save" onClick={() => navigate('/rewear')}>
                        Go to Recycle Dashboard
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="accordion-section">
            <button
              className={`accordion-header ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'security' ? '' : 'security')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Security</span>
              <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {activeSection === 'security' && (
              <div className="accordion-content">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}>Cancel</button>
                  <button className="btn-save" onClick={handleChangePassword}>Get OTP</button>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info Section */}
          <div className="accordion-section">
            <button
              className={`accordion-header ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'contact' ? '' : 'contact')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Contact Info</span>
              <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {activeSection === 'contact' && (
              <div className="accordion-content">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setPhone(userData.phone || '')}>Cancel</button>
                  <button className="btn-save" onClick={handleSaveContactInfo}>Save Changes</button>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Address Section */}
          <div className="accordion-section">
            <button
              className={`accordion-header ${activeSection === 'delivery' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'delivery' ? '' : 'delivery')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Delivery address</span>
              <svg className="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {activeSection === 'delivery' && (
              <div className="accordion-content">
                {!showAddressForm && (
                  <button className="btn-add-address" onClick={() => setShowAddressForm(true)}>
                    + Add New Address
                  </button>
                )}

                {showAddressForm && (
                  <form className="address-form" onSubmit={handleAddAddress}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name*</label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number*</label>
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Street Address*</label>
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>City*</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>State*</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Zipcode*</label>
                        <input
                          type="text"
                          placeholder="Zipcode"
                          value={addressForm.zipcode}
                          onChange={(e) => setAddressForm({ ...addressForm, zipcode: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Country*</label>
                        <input
                          type="text"
                          placeholder="Country"
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn-cancel" onClick={() => {
                        setShowAddressForm(false);
                        setAddressForm({
                          name: '',
                          phone: '',
                          street: '',
                          city: '',
                          state: '',
                          zipcode: '',
                          country: ''
                        });
                      }}>Cancel</button>
                      <button type="submit" className="btn-save">Save Address</button>
                    </div>
                  </form>
                )}

                {addresses.length > 0 && (
                  <div className="addresses-list">
                    {addresses.map((address) => (
                      <div key={address._id} className="address-card-new">
                        <div className="address-info">
                          <h4>{address.name}</h4>
                          <p>{address.street}, {address.city}</p>
                          <p>{address.state}, {address.zipcode}</p>
                          <p>{address.country}</p>
                          <p className="address-phone">{address.phone}</p>
                        </div>
                        <button
                          className="btn-delete-address"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>


        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />
    </div>
  )
}

export default Profile
