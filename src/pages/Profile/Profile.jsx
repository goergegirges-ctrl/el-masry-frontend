import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';

// New Components
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileStats from '../../components/Profile/ProfileStats';
import QuickActions from '../../components/Profile/QuickActions';
import AccountInfo from '../../components/Profile/AccountInfo';
import ChangePasswordModal from '../../components/Profile/ChangePasswordModal';

import '../../components/Profile/ProfileComponents.css';
import { useLanguage } from '../../context/LanguageContext';

const Profile = () => {
    const { userData, token, setToken, setUserData, getWishlistCount } = useContext(StoreContext);
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
    const [activeOrdersCount, setActiveOrdersCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            navigate("/login");
            return;
        }
        
        const fetchProfile = async () => {
            try {
                const response = await axiosClient.get('/api/users/profile');
                if (response.data.success) {
                    setProfileData(response.data.user);
                    setEditForm({
                        firstName: response.data.user.firstName || '',
                        lastName: response.data.user.lastName || '',
                        phone: response.data.user.phone || ''
                    });
                } else {
                    setProfileData(userData);
                    setEditForm({
                        firstName: userData?.firstName || '',
                        lastName: userData?.lastName || '',
                        phone: ''
                    });
                }
            } catch (err) {
                console.error("Error fetching profile", err);
                setProfileData(userData);
            }
        };

        const fetchOrdersCount = async () => {
            try {
                const response = await axiosClient.get('/api/order/userorders');
                if (response.data.success) {
                    const activeCount = response.data.data.filter(o => {
                        const s = (o.status || '').toLowerCase();
                        return !['delivered', 'cancelled'].includes(s);
                    }).length;
                    setActiveOrdersCount(activeCount);
                }
            } catch (err) {
                console.error("Error fetching orders count", err);
            }
        };

        Promise.all([fetchProfile(), fetchOrdersCount()]).finally(() => {
            setLoading(false);
        });
        
    }, [token, navigate, userData]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUserData(null);
        navigate("/");
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.put('/api/users/profile', editForm);
            if (response.data.success) {
                setProfileData(response.data.user);
                setUserData({
                    ...userData,
                    firstName: response.data.user.firstName,
                    lastName: response.data.user.lastName,
                    phone: response.data.user.phone
                });
                toast.success(t('profile_updateSuccess'));
                setIsEditing(false);
            } else {
                toast.error(response.data.message || t('profile_updateFailed'));
            }
        } catch (err) {
            console.error("Update error", err);
            toast.error(t('profile_updateError'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading-overlay">
                <div className="spinner"></div>
                <p>{t('profile_loading')}</p>
            </div>
        );
    }

    if (!userData || !profileData) {
        return (
            <div className="profile-container" style={{textAlign: "center", padding: "40px"}}>
                <p style={{marginBottom: "20px"}}>{t('profile_sessionExpired')}</p>
                <button onClick={logout} className="logout-btn-navy">{t('profile_loginAgain')}</button>
            </div>
        );
    }

    return (
        <div className='profile-redesign-container'>
            <ProfileHeader userData={profileData} />

            <ProfileStats activeOrders={activeOrdersCount} wishlistCount={getWishlistCount()} />

            <QuickActions onSecurityClick={() => setIsModalOpen(true)} />

            <div id="account-info-section">
                <AccountInfo 
                    profileData={profileData}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    editForm={editForm}
                    handleEditChange={handleEditChange}
                    handleSaveProfile={handleSaveProfile}
                />
            </div>

            <div className="profile-footer-actions">
                <button onClick={logout} className="logout-btn-redesign">
                    <LogOut size={20} />
                    <span>{t('profile_logout')}</span>
                </button>
            </div>

            <ChangePasswordModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}

export default Profile;

