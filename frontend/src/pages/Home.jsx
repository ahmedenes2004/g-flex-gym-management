import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="animate-fade-in" style={{ marginTop: '4rem' }}>
            <div className="glass glass-panel text-center">
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>G-Flex Gym'e Hoş Geldiniz</h1>
                <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Fitness yolculuğunuz için en üst düzey yönetim sistemi. Ders ayırtın, ödemeleri takip edin ve hedeflerinize ulaşın.
                </p>
                <div className="d-flex justify-center" style={{ gap: '1rem', justifyContent: 'center' }}>
                    {user ? (
                        <>
                            <h3 className="text-gradient mb-0 mt-2" style={{ marginRight: '1rem' }}>Hoş geldin, {user.name}!</h3>
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Panele Git</Link>
                            <Link to="/classes" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)' }}>Derslere Git</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Hemen Başla</Link>
                            <Link to="/login" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)' }}>Üye Girişi</Link>
                        </>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-3 mt-4">
                <div className="glass glass-panel text-center">
                    <h3 className="mb-2">Ders Ayırtın</h3>
                    <p className="text-muted">Yoga, pilates veya ağırlık çalışmalarında yerinizi kolayca ayırtın.</p>
                </div>
                <div className="glass glass-panel text-center">
                    <h3 className="mb-2">Ödemeleri Takip Edin</h3>
                    <p className="text-muted">Üyelik planlarınızı güvenle yönetin ve fatura geçmişinizi inceleyin.</p>
                </div>
                <div className="glass glass-panel text-center">
                    <h3 className="mb-2">Uzman Eğitmenler</h3>
                    <p className="text-muted">Maksimum sonuç almak için sektördeki en iyi profesyonellerle çalışın.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
