import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 className="text-gradient" style={{ margin: 0 }}>G-Flex</h2>
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Anasayfa</Link></li>
                    {user ? (
                        <>
                            <li><Link to="/classes">Dersler</Link></li>
                            <li><Link to="/payments">Ödemeler</Link></li>
                            <li><Link to="/dashboard">Panel</Link></li>
                            <li><Link to="/profile">Profil</Link></li>
                            {user.role === 'admin' && (
                                <li><Link to="/admin" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Admin Paneli</Link></li>
                            )}
                            <li>
                                <button className="btn btn-danger" onClick={handleLogout} style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                                    Çıkış Yap ({user.name})
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Giriş Yap</Link></li>
                            <li><Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', color: 'white' }}>Kayıt Ol</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
