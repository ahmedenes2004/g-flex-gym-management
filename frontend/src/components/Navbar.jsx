import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useContext(AuthContext);

    // If the user is logged in, they will use the Sidebar navigation.
    // The top navbar is only for visitors before logging in.
    if (user) return null;

    return (
        <nav className="navbar" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 className="text-gradient" style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>G-Flex</h2>
                </Link>
                <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none' }}>
                    <li><Link to="/" style={{ textDecoration: 'none', fontWeight: 500 }}>Anasayfa</Link></li>
                    <li><Link to="/login" style={{ textDecoration: 'none', fontWeight: 500 }}>Giriş Yap</Link></li>
                    <li>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', color: 'white', textDecoration: 'none' }}>
                            Kayıt Ol
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
