import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../components/Notification';
import { API_URL } from '../config';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [membershipDaysLeft, setMembershipDaysLeft] = useState(null);
    const [activePlan, setActivePlan] = useState(null);
    const [loading, setLoading] = useState(true);

    // Water intake state (saved in localStorage per user)
    const [waterGlasses, setWaterGlasses] = useState(() => {
        const saved = localStorage.getItem(`water_intake_${user?._id}`);
        return saved ? Number(saved) : 0;
    });

    // Calorie intake / burn state (saved in localStorage per user)
    const [burnedCalories, setBurnedCalories] = useState(() => {
        const saved = localStorage.getItem(`calories_burned_${user?._id}`);
        return saved ? Number(saved) : 0;
    });

    const dailyCalorieGoal = 500;

    useEffect(() => {
        if (!user) return;

        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
                // Fetch classes and payments
                const [classesRes, paymentsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/classes`),
                    axios.get(`${API_URL}/api/payments`, config)
                ]);

                // 1. Filter enrolled classes
                const myClasses = classesRes.data.filter(cls => 
                    cls.enrolledMembers.includes(user._id)
                ).sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
                setEnrolledClasses(myClasses);

                // 2. Calculate membership status based on latest payment
                const myPayments = paymentsRes.data;
                if (myPayments.length > 0) {
                    const completedPayments = myPayments.filter(p => p.status === 'Completed');
                    if (completedPayments.length > 0) {
                        // Sort by date desc
                        completedPayments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
                        const latest = completedPayments[0];
                        
                        let durationDays = 30; // Monthly
                        if (latest.plan === 'Quarterly') durationDays = 90;
                        if (latest.plan === 'Yearly') durationDays = 365;

                        const purchaseDate = new Date(latest.paymentDate);
                        const expirationDate = new Date(purchaseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
                        const today = new Date();
                        
                        const diffTime = expirationDate - today;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        setMembershipDaysLeft(Math.max(0, diffDays));
                        setActivePlan(latest.plan);
                    }
                }
            } catch (error) {
                console.error("Dashboard verileri alınamadı", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    // Save water glass progress
    const handleAddWater = () => {
        if (waterGlasses >= 8) {
            showNotification('Harika! Günlük su hedefinize ulaştınız.', 'success');
            return;
        }
        const newValue = waterGlasses + 1;
        setWaterGlasses(newValue);
        localStorage.setItem(`water_intake_${user._id}`, newValue);
        showNotification('1 bardak (250ml) su eklendi.', 'success');
    };

    const handleResetWater = () => {
        setWaterGlasses(0);
        localStorage.setItem(`water_intake_${user._id}`, 0);
        showNotification('Su tüketimi sıfırlandı.', 'info');
    };

    // Log workout calories
    const handleLogWorkout = (calories) => {
        const newValue = burnedCalories + calories;
        setBurnedCalories(newValue);
        localStorage.setItem(`calories_burned_${user._id}`, newValue);
        showNotification(`${calories} kcal yaktınız! Harika iş.`, 'success');
    };

    const handleResetCalories = () => {
        setBurnedCalories(0);
        localStorage.setItem(`calories_burned_${user._id}`, 0);
        showNotification('Egzersiz kalorisi sıfırlandı.', 'info');
    };

    if (loading) return <div className="text-center mt-4">Yükleniyor...</div>;

    const waterFillHeight = Math.min(100, (waterGlasses / 8) * 100);
    const caloriePercentage = Math.min(100, (burnedCalories / dailyCalorieGoal) * 100);

    return (
        <div className="animate-fade-in" style={{ marginTop: '1rem' }}>
            {/* Welcome Banner */}
            <div className="glass glass-panel mb-4 glow-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Tekrar hoş geldin, {user.name}!</h2>
                        <p className="text-muted mt-1" style={{ margin: 0 }}>G-Flex ile bugün sınırlarını zorlamaya hazır mısın?</p>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                        background: 'rgba(99, 102, 241, 0.15)', 
                        color: 'var(--primary)', 
                        padding: '0.45rem 1.25rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        boxShadow: '0 0 10px rgba(99, 102, 241, 0.1)'
                    }}>{user.role === 'admin' ? 'Yönetici' : (user.role === 'trainer' ? 'Eğitmen' : 'Üye')}</span>
                </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 mb-4" style={{ gap: '1.5rem' }}>
                {/* Active Membership Widget */}
                <div className="glass glass-panel glow-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Üyelik Durumu</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--primary)">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        {activePlan ? (
                            <div style={{ marginTop: '0.5rem' }}>
                                <p style={{ fontSize: '1.1rem', margin: 0 }}>Aktif Plan: <strong style={{ color: 'var(--primary)' }}>{activePlan === 'Monthly' ? 'Aylık Üye' : (activePlan === 'Quarterly' ? '3 Aylık Üye' : 'Yıllık Üye')}</strong></p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Kalan Süre</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{membershipDaysLeft} Gün</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ 
                                        width: `${Math.min(100, (membershipDaysLeft / 30) * 100)}%`, 
                                        background: 'linear-gradient(to right, var(--primary), var(--success))', 
                                        height: '100%',
                                        borderRadius: '5px' 
                                    }}></div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <p className="text-muted" style={{ margin: 0 }}>Aktif bir spor salonu üyeliğiniz bulunmamaktadır.</p>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>Derslere kayıt olabilmek ve tesisi kullanabilmek için plan satın alın.</p>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/payments" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px', padding: '0.85rem' }}>
                            {activePlan ? 'Üyeliği Yenile / Planı Yükselt' : 'Üyelik Satın Al'}
                        </Link>
                    </div>
                </div>

                {/* Enrolled Classes Widget */}
                <div className="glass glass-panel glow-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Kayıtlı Derslerim</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--primary)">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            {enrolledClasses.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {enrolledClasses.slice(0, 2).map(cls => (
                                        <div key={cls._id} style={{ 
                                            background: 'rgba(255,255,255,0.02)', 
                                            border: '1px solid rgba(255,255,255,0.05)', 
                                            borderRadius: '10px', 
                                            padding: '0.85rem 1rem', 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{cls.name}</strong>
                                                <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>Eğitmen: {cls.trainer?.name || 'Belirtilmedi'}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ 
                                                    fontSize: '0.8rem', 
                                                    color: 'var(--primary)', 
                                                    fontWeight: '600',
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    padding: '0.25rem 0.6rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid rgba(99, 102, 241, 0.15)'
                                                }}>
                                                    {new Date(cls.schedule).toLocaleDateString('tr-TR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {enrolledClasses.length > 2 && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.5rem 0 0 0' }}>+ {enrolledClasses.length - 2} dersiniz daha bulunuyor.</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted text-center" style={{ padding: '1.5rem 0', margin: 0 }}>Henüz kayıt olduğunuz bir grup dersi yok.</p>
                            )}
                        </div>
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/classes" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px', padding: '0.85rem' }}>Ders Programını Gör</Link>
                    </div>
                </div>
            </div>

            {/* Row 2: Water Hydration Tracker and Calorie Burn widget */}
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                {/* Water Tracker Widget */}
                <div className="glass glass-panel glow-card text-center" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem', textAlign: 'left' }}>Günlük Su Tüketimi</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#38bdf8">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div className="water-glass-container" style={{ margin: '1.5rem 0' }}>
                        <div className="water-glass" style={{ border: '4px solid rgba(56, 189, 248, 0.25)', boxShadow: 'inset 0 0 20px rgba(56, 189, 248, 0.05)' }}>
                            <div className="water-fill" style={{ height: `${waterFillHeight}%` }}>
                                {waterFillHeight > 10 && <div className="water-wave"></div>}
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' }}>{waterGlasses * 250} ml </span>
                            <span className="text-muted">/ 2000 ml</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>Bugün {waterGlasses} / 8 bardak su içtiniz.</p>
                    </div>
                    <div className="d-flex" style={{ gap: '0.75rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', background: '#0284c7', boxShadow: 'none' }} onClick={handleAddWater}>+1 Bardak (250ml)</button>
                        <button className="btn" style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={handleResetWater}>Sıfırla</button>
                    </div>
                </div>

                {/* Calorie Goal Tracker */}
                <div className="glass glass-panel glow-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Egzersiz Kalori Takibi</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--success)">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Bugün antrenmanlarda harcadığınız enerjiyi hızlıca kaydedin.</p>
                        
                        <div style={{ margin: '1.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span className="text-muted">Yakılan Kalori</span>
                                <strong>{burnedCalories} / {dailyCalorieGoal} kcal</strong>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ 
                                    width: `${caloriePercentage}%`, 
                                    background: 'var(--success)', 
                                    height: '100%',
                                    borderRadius: '5px',
                                    transition: 'width 0.5s ease'
                                }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3" style={{ gap: '0.5rem', marginTop: '1rem' }}>
                            <button className="btn" style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }} onClick={() => handleLogWorkout(150)}>
                                Kardiyo (+150)
                            </button>
                            <button className="btn" style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }} onClick={() => handleLogWorkout(200)}>
                                Ağırlık (+200)
                            </button>
                            <button className="btn" style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }} onClick={() => handleLogWorkout(100)}>
                                Pilates (+100)
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Günlük hedef: 500 kcal</span>
                        <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', borderRadius: '6px' }} onClick={handleResetCalories}>
                            Sıfırla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
