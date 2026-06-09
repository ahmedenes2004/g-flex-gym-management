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
        <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
            {/* Welcome Banner */}
            <div className="glass glass-panel mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Tekrar hoş geldin, {user.name}!</h2>
                    <p className="text-muted mt-1">G-Flex ile fitness hedeflerine bir adım daha yakınsın.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                        background: 'rgba(99, 102, 241, 0.15)', 
                        color: 'var(--primary)', 
                        padding: '0.4rem 1rem', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>{user.role}</span>
                </div>
            </div>

            {/* Row 1: Membership and Registered Classes */}
            <div className="grid grid-cols-2 mb-4" style={{ gap: '1.5rem' }}>
                {/* Active Membership Widget */}
                <div className="glass glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 className="mb-2">Üyelik Durumu</h3>
                        {activePlan ? (
                            <div style={{ marginTop: '1.5rem' }}>
                                <p style={{ fontSize: '1.1rem' }}>Aktif Plan: <strong style={{ color: 'var(--primary)' }}>{activePlan === 'Monthly' ? 'Aylık Üye' : (activePlan === 'Quarterly' ? '3 Aylık Üye' : 'Yıllık Üye')}</strong></p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Kalan Süre</span>
                                    <span style={{ fontWeight: 'bold' }}>{membershipDaysLeft} Gün</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${Math.min(100, (membershipDaysLeft / 30) * 100)}%`, 
                                        background: 'linear-gradient(to right, var(--primary), var(--success))', 
                                        height: '100%',
                                        borderRadius: '5px' 
                                    }}></div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginTop: '1rem', textAlign: 'center', padding: '1rem 0' }}>
                                <p className="text-muted">Aktif bir spor salonu üyeliğiniz bulunmamaktadır.</p>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Derslere kayıt olabilmek ve tesisi kullanabilmek için plan satın alın.</p>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Link to="/payments" className="btn btn-primary" style={{ width: '100%' }}>{activePlan ? 'Üyeliği Yenile / Yükselt' : 'Üyelik Satın Al'}</Link>
                    </div>
                </div>

                {/* Enrolled Classes Widget */}
                <div className="glass glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 className="mb-2">Kayıtlı Derslerim</h3>
                        <div style={{ marginTop: '1rem' }}>
                            {enrolledClasses.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {enrolledClasses.slice(0, 2).map(cls => (
                                        <div key={cls._id} style={{ 
                                            background: 'rgba(255,255,255,0.03)', 
                                            border: '1px solid rgba(255,255,255,0.05)', 
                                            borderRadius: '8px', 
                                            padding: '0.75rem', 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <strong style={{ fontSize: '0.95rem' }}>{cls.name}</strong>
                                                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Eğitmen: {cls.trainer?.name || 'Belirtilmedi'}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500' }}>
                                                    {new Date(cls.schedule).toLocaleDateString('tr-TR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {enrolledClasses.length > 2 && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>+ {enrolledClasses.length - 2} dersiniz daha bulunuyor.</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted text-center" style={{ padding: '1.5rem 0' }}>Henüz kayıt olduğunuz bir grup dersi yok.</p>
                            )}
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Link to="/classes" className="btn btn-primary" style={{ width: '100%' }}>Ders Programını Gör</Link>
                    </div>
                </div>
            </div>

            {/* Row 2: Water Hydration Tracker and Calorie Burn widget */}
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                {/* Water Tracker Widget */}
                <div className="glass glass-panel text-center">
                    <h3 className="mb-3">Günlük Su Takibi</h3>
                    <div className="water-glass-container" style={{ margin: '1rem 0' }}>
                        <div className="water-glass">
                            <div className="water-fill" style={{ height: `${waterFillHeight}%` }}>
                                {waterFillHeight > 10 && <div className="water-wave"></div>}
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{waterGlasses * 250} ml </span>
                            <span className="text-muted">/ 2000 ml (Hedef)</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Bugün {waterGlasses} / 8 bardak su içtiniz.</p>
                    </div>
                    <div className="d-flex" style={{ gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={handleAddWater}>+1 Bardak</button>
                        <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)' }} onClick={handleResetWater}>Sıfırla</button>
                    </div>
                </div>

                {/* Calorie Goal Tracker */}
                <div className="glass glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 className="mb-2">Egzersiz Kalori Takibi</h3>
                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>Bugün antrenmanlarda harcadığınız enerjiyi kaydedin.</p>
                        
                        <div style={{ margin: '1.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span className="text-muted">Yakılan Kalori</span>
                                <strong>{burnedCalories} / {dailyCalorieGoal} kcal</strong>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
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
                            <button className="btn" style={{ padding: '0.4rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)' }} onClick={() => handleLogWorkout(150)}>
                                Kardiyo (150 kcal)
                            </button>
                            <button className="btn" style={{ padding: '0.4rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)' }} onClick={() => handleLogWorkout(200)}>
                                Ağırlık (200 kcal)
                            </button>
                            <button className="btn" style={{ padding: '0.4rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)' }} onClick={() => handleLogWorkout(100)}>
                                Pilates (100 kcal)
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                        <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none' }} onClick={handleResetCalories}>
                            Kalorileri Sıfırla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
