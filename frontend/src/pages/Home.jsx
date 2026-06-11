import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Auto redirect logged-in users so they only see this landing page when not logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="animate-fade-in" style={{ position: 'relative' }}>
            {/* Glowing lights for visual layout decoration */}
            <div className="hero-glow-1"></div>
            <div className="hero-glow-2"></div>

            {/* Hero Section */}
            <section className="landing-hero text-center">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <span style={{ 
                        background: 'rgba(99, 102, 241, 0.1)', 
                        color: 'var(--primary)', 
                        padding: '0.5rem 1.25rem', 
                        borderRadius: '30px', 
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        display: 'inline-block',
                        marginBottom: '1.5rem'
                    }}>
                        G-FLEX FITNESS CLUB
                    </span>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', fontWeight: 800, marginBottom: '1.5rem' }}>
                        Sınırlarını Aş,<br/>
                        <span className="text-gradient">Gücünü Keşfet!</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: '1.7' }}>
                        Fitness yolculuğunuz için tasarlanmış en üst düzey yönetim sistemi. Derslerinizi ayırtın, gelişim hedeflerinizi izleyin ve uzman eğitmenlerle hedeflerinize ulaşın.
                    </p>
                    <div className="d-flex" style={{ gap: '1.25rem', justifyContent: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                            Hemen Başla
                        </Link>
                        <Link to="/login" className="btn" style={{ padding: '1rem 2.25rem', fontSize: '1.1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            Üye Girişi
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats Grid */}
            <section className="glass glass-panel mb-4 text-center" style={{ padding: '2.5rem 1.5rem' }}>
                <div className="grid grid-cols-3">
                    <div className="stat-item">
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>5000+</h2>
                        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>Aktif Sporcu</p>
                    </div>
                    <div className="stat-item">
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>25+</h2>
                        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>Uzman Antrenör</p>
                    </div>
                    <div className="stat-item">
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>40+</h2>
                        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>Haftalık Grup Dersi</p>
                    </div>
                </div>
            </section>

            {/* Features/Services Section */}
            <section style={{ padding: '4rem 0' }}>
                <div className="text-center mb-4">
                    <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Neden G-Flex?</h2>
                    <p className="text-muted">Spor deneyiminizi bir üst seviyeye taşıyacak tüm özellikler tek bir çatı altında.</p>
                </div>
                <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                    <div className="glass glass-panel glow-card text-center" style={{ padding: '2.5rem 1.75rem' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="var(--primary)">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Kolay Ders Rezervasyonu</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Yoga, Pilates, CrossFit veya Spinning... İstediğiniz dersi haftalık takvimden anında seçin ve kontenjanınızı ayırtın.</p>
                    </div>

                    <div className="glass glass-panel glow-card text-center" style={{ padding: '2.5rem 1.75rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="var(--success)">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Gelişim ve Su Takibi</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Su tüketiminizi takip edin, antrenmanlarda yaktığınız kalorileri kaydedin ve BMI oranınızı görsel göstergelerle kontrol edin.</p>
                    </div>

                    <div className="glass glass-panel glow-card text-center" style={{ padding: '2.5rem 1.75rem' }}>
                        <div style={{ background: 'rgba(192, 132, 252, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="#c084fc">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Güvenli Ödeme & Fatura</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Üyelik işlemlerinizi 3D kart simülasyonu ile güvenle yapın, PDF/Yazdırılabilir faturalarınıza dilediğiniz an erişin.</p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section style={{ padding: '3rem 0' }}>
                <div className="text-center mb-4">
                    <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Üyelik Paketlerimiz</h2>
                    <p className="text-muted">Hedeflerinize ve bütçenize en uygun planı seçip fitness yolculuğunuza bugün başlayın.</p>
                </div>
                <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                    {/* Monthly */}
                    <div className="pricing-card">
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Aylık Plan</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Fitness'a yeni başlayanlar için.</p>
                            <div style={{ marginBottom: '2rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>$30</span>
                                <span className="text-muted"> / ay</span>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Sınırsız Gym Girişi</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Soyunma Kabini ve Duşlar</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Aylık Vücut Analizi</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>✗ Grup Dersleri</li>
                            </ul>
                        </div>
                        <Link to="/register" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', borderRadius: '10px' }}>Kayıt Ol</Link>
                    </div>

                    {/* Quarterly */}
                    <div className="pricing-card featured">
                        <div className="pricing-badge">EN POPÜLER</div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>3 Aylık Plan</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Disiplinli sporcular için.</p>
                            <div style={{ marginBottom: '2rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>$80</span>
                                <span className="text-muted"> / toplam</span>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Sınırsız Gym Girişi</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Soyunma Kabini ve Duşlar</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Aylık Vücut Analizi</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Haftalık 2 Grup Dersi Kaydı</li>
                            </ul>
                        </div>
                        <Link to="/register" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px' }}>Hemen Başla</Link>
                    </div>

                    {/* Yearly */}
                    <div className="pricing-card">
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Yıllık Plan</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Hayatını değiştirmek isteyenler için.</p>
                            <div style={{ marginBottom: '2rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>$280</span>
                                <span className="text-muted"> / yıl</span>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Sınırsız Gym Girişi</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Soyunma Kabini ve Duşlar</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Aylık Vücut Analizi</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Sınırsız Grup Derslerine Kayıt</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Ücretsiz Havlu Hizmeti</li>
                            </ul>
                        </div>
                        <Link to="/register" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', borderRadius: '10px' }}>Kayıt Ol</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
