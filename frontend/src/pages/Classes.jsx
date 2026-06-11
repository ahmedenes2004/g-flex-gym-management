import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { useNotification } from '../components/Notification';
import { API_URL } from '../config';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    
    // For admin/trainer to add classes
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Fitness');
    const [schedule, setSchedule] = useState('');
    const [capacity, setCapacity] = useState(20);

    // Filter states
    const [selectedDay, setSelectedDay] = useState('Hepsi');
    const [selectedCategory, setSelectedCategory] = useState('Hepsi');

    const DAY_MAP = {
        1: 'Pazartesi',
        2: 'Salı',
        3: 'Çarşamba',
        4: 'Perşembe',
        5: 'Cuma',
        6: 'Cumartesi',
        0: 'Pazar'
    };

    const CATEGORIES = [
        'Hepsi',
        'Fitness',
        'Kardiyo & Koşu',
        'İp Atlama',
        'Pilates',
        'Yoga',
        'CrossFit',
        'Boks & Kickboks',
        'Spinning'
    ];

    const getCategoryStyles = (cat) => {
        switch (cat) {
            case 'Fitness':
                return { bg: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.2)', iconBg: '#6366f1' };
            case 'Kardiyo & Koşu':
                return { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(16, 185, 129, 0.2)', iconBg: '#10b981' };
            case 'İp Atlama':
                return { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)', iconBg: '#f59e0b' };
            case 'Pilates':
                return { bg: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.2)', iconBg: '#f43f5e' };
            case 'Yoga':
                return { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.2)', iconBg: '#8b5cf6' };
            case 'CrossFit':
                return { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)', iconBg: '#ef4444' };
            case 'Boks & Kickboks':
                return { bg: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.2)', iconBg: '#f97316' };
            case 'Spinning':
                return { bg: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.2)', iconBg: '#06b6d4' };
            default:
                return { bg: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', border: 'rgba(255, 255, 255, 0.1)', iconBg: '#94a3b8' };
        }
    };

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'Fitness':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.428 10.8a2.25 2.25 0 113.182 3.182l-5.502 5.502a.75.75 0 01-1.06 0l-2.122-2.122a.75.75 0 010-1.06l5.502-5.502zM17.572 13.2a2.25 2.25 0 11-3.182-3.182l5.502-5.502a.75.75 0 011.06 0l2.122 2.122a.75.75 0 010 1.06l-5.502 5.502zM12 9l-3 3M15 12l-3 3M9 9l6 6" />
                    </svg>
                );
            case 'Kardiyo & Koşu':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'İp Atlama':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'Pilates':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
            case 'Yoga':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                );
            case 'CrossFit':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                );
            case 'Boks & Kickboks':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                );
            case 'Spinning':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const fetchClasses = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/classes`);
            setClasses(data);
        } catch (error) {
            console.error('Dersler yüklenirken hata oluştu', error);
            showNotification('Ders programı yüklenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/classes`, {
                name, description, category, schedule, capacity
            }, config);
            showNotification('Ders başarıyla oluşturuldu!', 'success');
            fetchClasses();
            setName('');
            setDescription('');
            setCategory('Fitness');
            setSchedule('');
            setCapacity(20);
        } catch (error) {
            showNotification(error.response?.data?.message || 'Ders oluşturulurken hata oluştu.', 'error');
        }
    };

    const handleEnroll = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/classes/${id}/enroll`, {}, config);
            showNotification('Başarıyla derse kayıt oldunuz! "Derslerim" sayfasından takip edebilirsiniz.', 'success');
            fetchClasses();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Kayıt sırasında hata oluştu.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu dersi silmek istediğinize emin misiniz?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/api/classes/${id}`, config);
                showNotification('Ders başarıyla silindi.', 'success');
                fetchClasses();
            } catch (error) {
                showNotification(error.response?.data?.message || 'Silme işlemi sırasında hata.', 'error');
            }
        }
    };

    // Filter classes based on selected weekday & category
    const filteredClasses = classes.filter((cls) => {
        if (selectedCategory !== 'Hepsi' && cls.category !== selectedCategory) return false;
        if (selectedDay === 'Hepsi') return true;
        if (!cls.schedule) return false;
        const date = new Date(cls.schedule);
        return DAY_MAP[date.getDay()] === selectedDay;
    });

    const getCapacityStatus = (enrolled, cap) => {
        const spotsLeft = cap - enrolled;
        if (spotsLeft === 0) return { text: 'Kontenjan Dolu', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.15)' };
        if (spotsLeft <= 3) return { text: `Son ${spotsLeft} Kontenjan!`, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
        return { text: `${spotsLeft} Boş Yer`, color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)' };
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '1rem' }}>
            <div className="d-flex justify-between align-center mb-4">
                <div>
                    <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Ders Kataloğu</h2>
                    <p className="text-muted">Katılmak istediğiniz dersi seçin ve kendinizi geliştirin.</p>
                </div>
            </div>
            
            {(user.role === 'admin' || user.role === 'trainer') && (
                <div className="glass glass-panel mb-4">
                    <h3>Yeni Ders Ekle</h3>
                    <form onSubmit={handleCreateClass} className="mt-3 grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Ders Adı</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Kardiyo Kickboks" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ders Kategorisi</label>
                            <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.filter(c => c !== 'Hepsi').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tarih ve Saat</label>
                            <input type="datetime-local" className="form-control" value={schedule} onChange={e => setSchedule(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Kontenjan</label>
                            <input type="number" className="form-control" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Açıklama</label>
                            <textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ders içeriği, gereksinimler ve detaylar..." required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>Dersi Oluştur</button>
                    </form>
                </div>
            )}

            {/* Category Filter Tabs */}
            <div className="mb-4">
                <span className="form-label" style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Kategori Seçin</span>
                <div className="calendar-tabs" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {CATEGORIES.map((cat) => {
                        const styles = getCategoryStyles(cat);
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                className={`calendar-tab ${isSelected ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                                style={isSelected ? {
                                    background: styles.iconBg,
                                    borderColor: styles.iconBg,
                                    color: 'white'
                                } : {}}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Weekly Calendar day filtering tabs */}
            {!loading && (
                <div className="mb-4">
                    <span className="form-label" style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Haftalık Gün Seçin</span>
                    <WeeklyCalendar 
                        classes={classes} 
                        selectedDay={selectedDay} 
                        onDaySelect={setSelectedDay} 
                    />
                </div>
            )}

            {loading ? (
                <div className="d-flex align-center justify-center" style={{ padding: '4rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(255, 255, 255, 0.1)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'wave 1.5s linear infinite'
                    }}></div>
                </div>
            ) : (
                <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                    {filteredClasses.map((cls) => {
                        const capInfo = getCapacityStatus(cls.enrolledMembers.length || cls.enrolledMembers.map(m => m._id || m).length, cls.capacity);
                        const isEnrolled = cls.enrolledMembers.some(member => {
                            const memberId = member._id || member;
                            return memberId === user._id;
                        });
                        const styles = getCategoryStyles(cls.category);
                        
                        return (
                            <div key={cls._id} className="glass glow-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', border: `1px solid ${styles.border}` }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ 
                                            background: styles.bg, 
                                            color: styles.color, 
                                            padding: '0.3rem 0.8rem', 
                                            borderRadius: '30px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            border: `1px solid ${styles.border}`
                                        }}>
                                            {getCategoryIcon(cls.category)}
                                            {cls.category || 'Fitness'}
                                        </span>
                                        <span style={{ 
                                            background: capInfo.bg, 
                                            color: capInfo.color, 
                                            padding: '0.2rem 0.6rem', 
                                            borderRadius: '6px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600'
                                        }}>
                                            {capInfo.text}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>{cls.name}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem', minHeight: '3.6rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {cls.description || 'Açıklama belirtilmemiş.'}
                                    </p>
                                    <div className="mt-3" style={{ fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                                        <p style={{ marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-muted">Eğitmen:</span>
                                            <strong style={{ color: '#fff' }}>{cls.trainer?.name || 'Belirtilmedi'}</strong>
                                        </p>
                                        <p style={{ marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-muted">Gün:</span>
                                            <strong style={{ color: '#fff' }}>{DAY_MAP[new Date(cls.schedule).getDay()]}</strong>
                                        </p>
                                        <p style={{ marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-muted">Saat:</span>
                                            <strong style={{ color: '#fff' }}>{new Date(cls.schedule).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</strong>
                                        </p>
                                        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-muted">Kayıtlı Sporcu:</span>
                                            <strong style={{ color: '#fff' }}>{cls.enrolledMembers.length} / {cls.capacity}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex mt-4" style={{ gap: '0.5rem' }}>
                                    <button 
                                        className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`} 
                                        style={isEnrolled ? { flex: 1, padding: '0.65rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.05)' } : { flex: 1, padding: '0.65rem' }}
                                        onClick={() => !isEnrolled && handleEnroll(cls._id)}
                                        disabled={isEnrolled || cls.enrolledMembers.length >= cls.capacity}
                                    >
                                        {isEnrolled ? 'Kayıtlısınız ✓' : (cls.enrolledMembers.length >= cls.capacity ? 'Sınıf Dolu' : 'Derse Kayıt Ol')}
                                    </button>
                                    {(user.role === 'admin' || (user.role === 'trainer' && cls.trainer?._id === user._id)) && (
                                        <button className="btn btn-danger" style={{ padding: '0.65rem' }} onClick={() => handleDelete(cls._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filteredClasses.length === 0 && (
                        <div className="glass glass-panel text-center text-muted" style={{ gridColumn: '1/-1', padding: '3rem' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Aradığınız kriterlere uygun ders bulunamadı.</p>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Farklı bir kategori veya gün seçmeyi deneyebilirsiniz.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Classes;
