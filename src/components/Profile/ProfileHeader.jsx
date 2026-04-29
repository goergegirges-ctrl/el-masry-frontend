import React from 'react';
import { User, Mail } from 'lucide-react';
import './ProfileComponents.css';

const ProfileHeader = ({ userData }) => {
  if (!userData) return null;

  const initials = `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="profile-header-redesign">
      <div className="avatar-circle">
        {initials || <User size={40} />}
      </div>
      <div className="user-meta">
        <div className="name-row">
          <h1 className="user-fullname">{userData.firstName} {userData.lastName}</h1>
        </div>
        <div className="email-row">
          <Mail size={16} className="meta-icon" />
          <span className="user-email">{userData.email}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
