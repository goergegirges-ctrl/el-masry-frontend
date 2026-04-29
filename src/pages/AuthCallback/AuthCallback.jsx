import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import axiosClient from '../../utils/axiosClient';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { setToken, setUserData, syncUserWishlist } = useContext(StoreContext);
    const { t } = useLanguage();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the session Supabase set after the OAuth redirect
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    toast.error(t('auth_oauthError'));
                    navigate('/login');
                    return;
                }

                const { user: supabaseUser } = session;
                const meta = supabaseUser.user_metadata || {};

                // Split full_name into first / last if name fields not separate
                const fullName = meta.full_name || meta.name || '';
                const nameParts = fullName.trim().split(' ');
                const firstName = meta.given_name || nameParts[0] || '';
                const lastName = meta.family_name || nameParts.slice(1).join(' ') || '';

                // Exchange Supabase session for our own JWT
                const response = await axiosClient.post('/api/users/oauth-login', {
                    supabaseUserId: supabaseUser.id,
                    email: supabaseUser.email,
                    firstName,
                    lastName,
                    provider: supabaseUser.app_metadata?.provider || 'oauth',
                });

                if (response.data.success) {
                    const { token, user } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    setToken(token);
                    setUserData(user);
                    await syncUserWishlist(token, user);
                    toast.success(t('auth_welcomeToast'));
                    navigate('/');
                } else {
                    toast.error(response.data.message || t('auth_oauthError'));
                    navigate('/login');
                }
            } catch (err) {
                console.error('AuthCallback error:', err);
                toast.error(t('auth_oauthError'));
                navigate('/login');
            }
        };

        handleCallback();
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '16px',
            color: 'var(--ink-500)',
            fontFamily: 'var(--font-en)',
        }}>
            <div style={{
                width: 40,
                height: 40,
                border: '3px solid var(--line-200)',
                borderTopColor: 'var(--cyan-400)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ margin: 0, fontSize: 14 }}>{t('auth_oauthProcessing')}</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AuthCallback;
