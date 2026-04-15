import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../utils/axiosClient';
import './ProfileComponents.css';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/api/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Password change error", err);
      toast.error(err.response?.data?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>
          <X size={24} />
        </div>
        
        <div className="modal-header-text" style={{marginBottom: '1.5rem'}}>
          <h2 style={{fontSize: '20px', fontWeight: '700', color: 'var(--text)'}}>Account Security</h2>
          <p style={{fontSize: '14px', color: 'var(--text-light)'}}>Update your account password</p>
        </div>

        <form onSubmit={handleSubmit} className="inline-edit-form">
          <div className="input-group">
            <label>Current Password</label>
            <div style={{position: 'relative'}}>
              <input 
                type={showCurrent ? "text" : "password"} 
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                required
                style={{width: '100%', paddingRight: '40px'}}
              />
              <button 
                type="button" 
                onClick={() => setShowCurrent(!showCurrent)}
                style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-light)'}}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>New Password</label>
            <div style={{position: 'relative'}}>
              <input 
                type={showNew ? "text" : "password"} 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                style={{width: '100%', paddingRight: '40px'}}
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-light)'}}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat new password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="save-btn" 
            disabled={loading}
            style={{width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
          >
            {loading ? <div className="spinner" style={{width: '18px', height: '18px', borderThickness: '2px'}}></div> : <Lock size={18} />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
