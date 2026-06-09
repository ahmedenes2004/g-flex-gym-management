import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const { showNotification } = useNotification();
    
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [targetWeight, setTargetWeight] = useState(0);
    const [loading, setLoading] = useState(false);

    // BMR specific states
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState(25);
    const [activityLevel, setActivityLevel] = useState(1.375); // Light active

    // Weight history state (persisted per user)
    const [weightHistory, setWeightHistory] = useState(() => {
        const saved = localStorage.getItem(`weight_history_${user?._id}`);
        if (saved) return JSON.parse(saved);
        
        // Initial mock history path matching the profile
        const initialWeight = user?.profile?.weight || 80;
        return [
            { date: '01.05', weight: initialWeight + 4 },
            { date: '10.05', weight: initialWeight + 2.5 },
            { date: '20.05', weight: initialWeight + 1.2 },
            { date: '01.06', weight: initialWeight + 0.5 },
            { date: '09.06', weight: initialWeight }
        ];
    });

    useEffect(() => {
        if (user && user.profile) {
            setHeight(user.profile.height || 0);
            setWeight(user.profile.weight || 0);
            setTargetWeight(user.profile.targetWeight || 0);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put('http://localhost:5000/api/auth/profile', {
                height: Number(height),
                weight: Number(weight),
                targetWeight: Number(targetWeight)
            }, config);
            
            updateProfile(data);
            showNotification('Profil ve gelişim verileri başarıyla güncellendi!', 'success');

            // Log entry into weight history chart
            const dateStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
            const newEntry = { date: dateStr, weight: Number(weight) };
            
            // Clean duplicates of the same day and slice to keep last 6 records
            const updatedHistory = [...weightHistory.filter(h => h.date !== dateStr), newEntry].slice(-6);
            setWeightHistory(updatedHistory);
            localStorage.setItem(`weight_history_${user._id}`, JSON.stringify(updatedHistory));
        } catch (error) {
            showNotification('Profil güncellenirken bir hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 1. BMI Calculations
    const getBmi = () => {
        if (height === 0 || weight === 0) return 0;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const bmi = Number(getBmi());

    const getBmiCategory = (val) => {
        if (val === 0) return 'Hesaplanamadı';
        if (val < 18.5) return 'Zayıf (Underweight)';
        if (val < 25) return 'Normal Kilo (Ideal)';
        if (val < 30) return 'Fazla Kilolu (Overweight)';
        return 'Obez (Obese)';
    };

    const getBmiCategoryColor = (val) => {
        if (val === 0) return 'var(--text-muted)';
        if (val < 18.5) return '#38bdf8'; // Sky Blue
        if (val < 25) return 'var(--success)'; // Green
        if (val < 30) return '#fbbf24'; // Yellow
        return 'var(--danger)'; // Red
    };

    // Map BMI from range [15, 35] to [0%, 100%]
    const getBmiPointerPosition = (val) => {
        if (val === 0) return 0;
        const minBmi = 15;
        const maxBmi = 35;
        const percentage = ((val - minBmi) / (maxBmi - minBmi)) * 100;
        return Math.min(100, Math.max(0, percentage));
    };

    // 2. BMR Calculations (Harris-Benedict Equation)
    const calculateBmr = () => {
        if (weight === 0 || height === 0 || age === 0) return 0;
        let bmrVal = 0;
        if (gender === 'male') {
            bmrVal = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmrVal = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        return Math.round(bmrVal);
    };

    const bmr = calculateBmr();
    const tdee = Math.round(bmr * activityLevel); // Total Daily Energy Expenditure

    const getProgress = () => {
        if (weight === 0 || targetWeight === 0) return 0;
        const diff = Math.abs(weight - targetWeight);
        if (diff === 0) return 100;
        // Simple progress metric towards target weight
        return Math.max(0, Math.min(100, 100 - (diff * 4)));
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <h2 className="mb-4 text-center text-gradient">Gelişim Takibi & Sağlık Paneli</h2>
            
            <div className="grid grid-cols-2" style={{ gap: '2rem', alignItems: 'start' }}>
                {/* Left side: Profile edit and weight graph */}
                <div>
                    <h3 className="mb-3">Profil ve Kilo Güncelle</h3>
                    <div className="glass glass-panel mb-4">
                        <form onSubmit={handleUpdate} className="grid grid-cols-1" style={{ gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Boy (cm)</label>
                                <input type="number" className="form-control" value={height} onChange={e => setHeight(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Mevcut Kilo (kg)</label>
                                <input type="number" className="form-control" value={weight} onChange={e => setWeight(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Hedef Kilo (kg)</label>
                                <input type="number" className="form-control" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                                {loading ? 'Güncelleniyor...' : 'Verileri Kaydet'}
                            </button>
                        </form>
                    </div>

                    <h3 className="mb-3">Kilo Değişim Grafiği</h3>
                    <div className="glass glass-panel" style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} name="Kilo (kg)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right side: BMI and BMR calculators */}
                <div>
                    <h3 className="mb-3">Vücut Kitle İndeksi (BMI)</h3>
                    <div className="glass glass-panel mb-4 text-center">
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getBmiCategoryColor(bmi) }}>
                            {bmi > 0 ? bmi : '--'}
                        </div>
                        <p style={{ fontWeight: '600', color: getBmiCategoryColor(bmi), fontSize: '1.1rem' }}>
                            {getBmiCategory(bmi)}
                        </p>

                        <div className="bmi-gauge-container">
                            <div className="bmi-track">
                                <div className="bmi-pointer" style={{ left: `${getBmiPointerPosition(bmi)}%` }}></div>
                            </div>
                            <div className="bmi-labels">
                                <span>15 (Zayıf)</span>
                                <span>25 (İdeal)</span>
                                <span>30 (Fazla)</span>
                                <span>35+ (Obez)</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ width: `${getProgress()}%`, background: 'var(--success)', height: '100%', transition: 'width 0.5s ease' }}></div>
                        </div>
                        <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Hedef Kilo İlerlemesi: %{getProgress()}</p>
                    </div>

                    <h3 className="mb-3">Kalori Hesaplayıcı (BMR)</h3>
                    <div className="glass glass-panel">
                        <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Cinsiyet</label>
                                <select className="form-control" value={gender} onChange={e => setGender(e.target.value)}>
                                    <option value="male">Erkek</option>
                                    <option value="female">Kadın</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Yaş</label>
                                <input type="number" className="form-control" value={age} onChange={e => setAge(Math.max(1, Number(e.target.value)))} />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Aktivite Seviyesi</label>
                            <select className="form-control" value={activityLevel} onChange={e => setActivityLevel(Number(e.target.value))}>
                                <option value="1.2">Masa başı / Egzersiz Yok</option>
                                <option value="1.375">Hafif Aktif (Haftada 1-3 Gün Spor)</option>
                                <option value="1.55">Orta Aktif (Haftada 3-5 Gün Spor)</option>
                                <option value="1.725">Çok Aktif (Haftada 6-7 Gün Ağır Spor)</option>
                            </select>
                        </div>

                        {bmr > 0 ? (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span className="text-muted">Bazal Metabolizma Hızı (BMR):</span>
                                    <strong>{bmr} kcal</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span className="text-muted">Günlük Yakılan Kalori (TDEE):</span>
                                    <strong style={{ color: 'var(--primary)' }}>{tdee} kcal</strong>
                                </div>

                                <div className="grid grid-cols-3" style={{ gap: '0.5rem', textAlign: 'center', marginTop: '0.75rem' }}>
                                    <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kilo Verme</div>
                                        <strong style={{ color: '#38bdf8' }}>{tdee - 500} kcal</strong>
                                    </div>
                                    <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kiloyu Koru</div>
                                        <strong style={{ color: 'var(--success)' }}>{tdee} kcal</strong>
                                    </div>
                                    <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kilo Alma</div>
                                        <strong style={{ color: 'var(--danger)' }}>{tdee + 500} kcal</strong>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted text-center" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>Hesaplama için lütfen boy ve kilonuzu yukarıdan güncelleyin.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
