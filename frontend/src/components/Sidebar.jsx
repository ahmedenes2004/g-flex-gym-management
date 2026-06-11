import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    if (!user) return null;

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Yönetici';
            case 'trainer': return 'Eğitmen';
            default: return 'Üye';
        }
    };

    return (
        <>
            {/* Sidebar Drawer Overlay for Mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/dashboard" onClick={onClose} style={{ textDecoration: 'none' }}>
                        <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>G-Flex</h2>
                    </Link>
                    {/* Close button for mobile */}
                    <button className="menu-toggle-btn" onClick={onClose} style={{ display: 'none' }} id="close-sidebar-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {getInitials(user.name)}
                    </div>
                    <div className="profile-info">
                        <div className="profile-name" title={user.name}>{user.name}</div>
                        <div className="profile-role">{getRoleLabel(user.role)}</div>
                    </div>
                </div>

                <ul className="sidebar-menu">
                    <li className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}>
                        <Link to="/dashboard" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>Panelim</span>
                        </Link>
                    </li>

                    <li className={`sidebar-item ${isActive('/classes') ? 'active' : ''}`}>
                        <Link to="/classes" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Grup Dersleri</span>
                        </Link>
                    </li>

                    <li className={`sidebar-item ${isActive('/payments') ? 'active' : ''}`}>
                        <Link to="/payments" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span>Ödemeler & Planlar</span>
                        </Link>
                    </li>

                    <li className={`sidebar-item ${isActive('/profile') ? 'active' : ''}`}>
                        <Link to="/profile" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profilim</span>
                        </Link>
                    </li>

                    {user.role === 'admin' && (
                        <li className={`sidebar-item ${isActive('/admin') ? 'active' : ''}`}>
                            <Link to="/admin" onClick={onClose} style={{ color: 'rgba(129, 140, 248, 1)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span style={{ fontWeight: 'bold' }}>Admin Paneli</span>
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="sidebar-footer">
                    <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.65rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* CSS style rule override for toggle button visibility in mobile */}
            <style>{`
                @media (max-width: 992px) {
                    #close-sidebar-btn {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
