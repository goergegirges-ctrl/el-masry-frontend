import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import './ProfileComponents.css';
import { useLanguage } from '../../context/LanguageContext';

const AccountInfo = ({
  profileData,
  isEditing,
  setIsEditing,
  editForm,
  handleEditChange,
  handleSaveProfile
}) => {
  const { t } = useLanguage();
  if (!profileData) return null;

  return (
    <div className="account-info-card">
      <div className="info-header">
        <h2>{t('profile_accountInfo')}</h2>
        {!isEditing && (
          <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
            {t('profile_edit')}
          </button>
        )}
      </div>

      <div className="info-body">
        {isEditing ? (
          <form className="inline-edit-form" onSubmit={handleSaveProfile}>
            <div className="input-group">
              <label>{t('profile_firstName')}</label>
              <input
                type="text"
                name="firstName"
                value={editForm.firstName}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="input-group">
              <label>{t('profile_lastName')}</label>
              <input
                type="text"
                name="lastName"
                value={editForm.lastName}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="input-group">
              <label>{t('profile_phone')}</label>
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
              />
            </div>
            <div className="edit-actions">
              <button type="submit" className="save-btn">{t('profile_saveChanges')}</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                {t('profile_cancel')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="info-row">
              <div className="row-label">
                <User size={16} />
                {t('profile_fullName')}
              </div>
              <div className="row-value">{profileData.firstName} {profileData.lastName}</div>
            </div>
            <div className="info-row">
              <div className="row-label">
                <Mail size={16} />
                {t('profile_email')}
              </div>
              <div className="row-value">{profileData.email}</div>
            </div>
            <div className="info-row">
              <div className="row-label">
                <Phone size={16} />
                {t('profile_phoneLabel')}
              </div>
              <div className="row-value">{profileData.phone || t('profile_notProvided')}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
