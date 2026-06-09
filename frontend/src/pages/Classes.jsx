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
    const [schedule, setSchedule] = useState('');
    const [capacity, setCapacity] = useState(20);

    // Day filter state
    const [selectedDay, setSelectedDay] = useState('Hepsi');

    const DAY_MAP = {
        1: 'Pazartesi',
        2: 'Salı',
        3: 'Çarşamba',
        4: 'Perşembe',
        5: 'Cuma',
        6: 'Cumartesi',
        0: 'Pazar'
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
                name, description, schedule, capacity
            }, config);
            showNotification('Ders başarıyla oluşturuldu!', 'success');
            fetchClasses();
            setName('');
            setDescription('');
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
            showNotification('Başarıyla derse kayıt oldunuz!', 'success');
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

    // Filter classes based on selected weekday
    const filteredClasses = classes.filter((cls) => {
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
        <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <h2 className="mb-4 text-gradient">Spor Dersleri ve Programı</h2>
            
            {(user.role === 'admin' || user.role === 'trainer') && (
                <div className="glass glass-panel mb-4">
                    <h3>Yeni Ders Ekle</h3>
                    <form onSubmit={handleCreateClass} className="mt-3 grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Ders Adı</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tarih ve Saat</label>
                            <input type="datetime-local" className="form-control" value={schedule} onChange={e => setSchedule(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Açıklama</label>
                            <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="Örn: Yoga başlangıç seviyesi dersi" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Kontenjan</label>
                            <input type="number" className="form-control" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>Dersi Oluştur</button>
                    </form>
                </div>
            )}

            {/* Weekly Calendar day filtering tabs */}
            {!loading && (
                <WeeklyCalendar 
                    classes={classes} 
                    selectedDay={selectedDay} 
                    onDaySelect={setSelectedDay} 
                />
            )}

            {loading ? <p>Dersler yükleniyor...</p> : (
                <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                    {filteredClasses.map((cls) => {
                        const capInfo = getCapacityStatus(cls.enrolledMembers.length, cls.capacity);
                        const isEnrolled = cls.enrolledMembers.includes(user._id);
                        
                        return (
                            <div key={cls._id} className="glass glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: '1.25rem' }}>{cls.name}</h3>
                                        <span style={{ 
                                            background: capInfo.bg, 
                                            color: capInfo.color, 
                                            padding: '0.2rem 0.6rem', 
                                            borderRadius: '6px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {capInfo.text}
                                        </span>
                                    </div>
                                    <p className="text-muted mt-2" style={{ fontSize: '0.9rem', minHeight: '2.7rem' }}>{cls.description || 'Açıklama belirtilmemiş.'}</p>
                                    <div className="mt-3" style={{ fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                                        <p style={{ marginBottom: '0.25rem' }}><strong>Eğitmen:</strong> {cls.trainer?.name || 'Belirtilmedi'}</p>
                                        <p style={{ marginBottom: '0.25rem' }}><strong>Gün:</strong> {DAY_MAP[new Date(cls.schedule).getDay()]}</p>
                                        <p style={{ marginBottom: '0.25rem' }}><strong>Saat:</strong> {new Date(cls.schedule).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p><strong>Doluluk:</strong> {cls.enrolledMembers.length} / {cls.capacity} Kişi</p>
                                    </div>
                                </div>
                                <div className="d-flex mt-4" style={{ gap: '0.5rem' }}>
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ flex: 1, padding: '0.6rem' }}
                                        onClick={() => handleEnroll(cls._id)}
                                        disabled={isEnrolled || cls.enrolledMembers.length >= cls.capacity}
                                    >
                                        {isEnrolled ? 'Kayıtlısınız ✓' : (cls.enrolledMembers.length >= cls.capacity ? 'Sınıf Dolu' : 'Derse Kayıt Ol')}
                                    </button>
                                    {(user.role === 'admin' || (user.role === 'trainer' && cls.trainer?._id === user._id)) && (
                                        <button className="btn btn-danger" style={{ padding: '0.6rem' }} onClick={() => handleDelete(cls._id)}>Sil</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filteredClasses.length === 0 && (
                        <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
                            Seçilen günde planlanmış ders bulunmamaktadır.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Classes;
