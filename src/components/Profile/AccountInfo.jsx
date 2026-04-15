import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import './ProfileComponents.css';

const AccountInfo = ({ 
  profileData, 
  isEditing, 
  setIsEditing, 
  editForm, 
  handleEditChange, 
  handleSaveProfile 
}) => {
  if (!profileData) return null;

  return (
    <div className="account-info-card">
      <div className="info-header">
        <h2>Account Information</h2>
        {!isEditing && (
          <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>

      <div className="info-body">
        {isEditing ? (
          <form className="inline-edit-form" onSubmit={handleSaveProfile}>
            <div className="input-group">
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName" 
                value={editForm.firstName} 
                onChange={handleEditChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={editForm.lastName} 
                onChange={handleEditChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                value={editForm.phone} 
                onChange={handleEditChange} 
              />
            </div>
            <div className="edit-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="info-row">
              <div className="row-label">
                <User size={16} />
                Full Name:
              </div>
              <div className="row-value">{profileData.firstName} {profileData.lastName}</div>
            </div>
            <div className="info-row">
              <div className="row-label">
                <Mail size={16} />
                Email:
              </div>
              <div className="row-value">{profileData.email}</div>
            </div>
            <div className="info-row">
              <div className="row-label">
                <Phone size={16} />
                Phone:
              </div>
              <div className="row-value">{profileData.phone || 'Not provided'}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
