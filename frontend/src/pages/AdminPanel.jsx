import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL } from '../config';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, users, enrollments
    
    // User search in User Management tab
    const [userSearch, setUserSearch] = useState('');
    // Class search in Class Enrollments tab
    const [classSearch, setClassSearch] = useState('');
    // Temporary selected user state for admin enrolling in each class
    const [selectedUserToEnroll, setSelectedUserToEnroll] = useState({});

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [statsRes, usersRes, classesRes] = await Promise.all([
                axios.get(`${API_URL}/api/stats`, config),
                axios.get(`${API_URL}/api/users`, config),
                axios.get(`${API_URL}/api/classes`, config)
            ]);
            setStats(statsRes.data);
            setUsersList(usersRes.data);
            setClassesList(classesRes.data);
        } catch (error) {
            console.error("Veriler alınamadı", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/users/${userId}/role`, { role: newRole }, config);
            
            // Update local state
            setUsersList(usersList.map(u => u._id === userId ? { ...u, role: newRole } : u));
            alert('Kullanıcı yetkisi başarıyla güncellendi!');
        } catch (error) {
            alert(error.response?.data?.message || 'Yetki güncellenirken hata oluştu');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bu kullanıcıyı tamamen silmek istediğinize emin misiniz?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/api/users/${userId}`, config);
                setUsersList(usersList.filter(u => u._id !== userId));
                alert('Kullanıcı başarıyla silindi!');
            } catch (error) {
                alert(error.response?.data?.message || 'Silme işlemi başarısız');
            }
        }
    };

    const handleAdminEnroll = async (classId) => {
        const userId = selectedUserToEnroll[classId];
        if (!userId) {
            alert('Lütfen derse kaydetmek için bir üye seçin.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/classes/${classId}/admin-enroll`, { userId }, config);
            
            // Clear selections and reload lists
            setSelectedUserToEnroll({ ...selectedUserToEnroll, [classId]: '' });
            fetchData();
            alert('Kullanıcı derse başarıyla kaydedildi.');
        } catch (error) {
            alert(error.response?.data?.message || 'Kayıt işlemi sırasında hata oluştu');
        }
    };

    const handleAdminUnenroll = async (classId, userId, userName) => {
        if (window.confirm(`${userName} isimli üyeyi bu dersten çıkarmak istediğinize emin misiniz?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`${API_URL}/api/classes/${classId}/admin-unenroll`, { userId }, config);
                fetchData();
                alert('Üye dersten başarıyla çıkarıldı.');
            } catch (error) {
                alert(error.response?.data?.message || 'Dersten çıkarma işlemi sırasında hata oluştu');
            }
        }
    };

    if (loading) return <div className="text-center mt-4">Yükleniyor...</div>;

    // Filter users list based on search
    const filteredUsers = usersList.filter(u => 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    // Filter classes list based on search
    const filteredClasses = classesList.filter(c => 
        c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
        (c.trainer?.name && c.trainer.name.toLowerCase().includes(classSearch.toLowerCase()))
    );

    return (
        <div className="animate-fade-in" style={{ marginTop: '1rem' }}>
            <h1 className="mb-4 text-gradient">Admin Yönetim Paneli</h1>

            {/* Sekme Butonları */}
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Sistem Özeti
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Kullanıcı Yönetimi
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'enrollments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enrollments')}
                >
                    Ders Atamaları & Kayıtlar
                </button>
            </div>

            {/* SEKME 1: Sistem Özeti */}
            {activeTab === 'overview' && (
                <div className="animate-fade-in">
                    {stats ? (
                        <>
                            <div className="grid grid-cols-3 mb-4">
                                <div className="glass glass-panel text-center glow-card">
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="var(--primary)">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h4>Toplam Üye</h4>
                                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', margin: '0.5rem 0 0 0' }}>{stats.totalUsers}</p>
                                </div>
                                <div className="glass glass-panel text-center glow-card">
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="var(--success)">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4>Toplam Gelir</h4>
                                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)', margin: '0.5rem 0 0 0' }}>${stats.totalRevenue}</p>
                                </div>
                                <div className="glass glass-panel text-center glow-card">
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="#c084fc">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h4>Aktif Ders Sayısı</h4>
                                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#c084fc', margin: '0.5rem 0 0 0' }}>{stats.totalClasses}</p>
                                </div>
                            </div>

                            <div className="glass glass-panel mb-4 glow-card" style={{ padding: '2rem' }}>
                                <h4 className="mb-3">Ders Doluluk & Popülerlik Oranları</h4>
                                <div style={{ height: 320 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.classPopularity}>
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                                            <YAxis stroke="#94a3b8" allowDecimals={false} fontSize={11} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                            <Bar dataKey="enrolled" name="Kayıtlı Üye" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted text-center">İstatistik bilgisi yüklenemedi.</p>
                    )}
                </div>
            )}

            {/* SEKME 2: Kullanıcı Yönetimi */}
            {activeTab === 'users' && (
                <div className="glass glass-panel animate-fade-in" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Sistem Üyeleri Listesi</h3>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="İsim veya e-posta ara..." 
                            value={userSearch} 
                            onChange={(e) => setUserSearch(e.target.value)} 
                            style={{ maxWidth: '300px' }} 
                        />
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem' }}>Üye Adı</th>
                                    <th style={{ padding: '1rem' }}>E-posta</th>
                                    <th style={{ padding: '1rem' }}>Kayıt Tarihi</th>
                                    <th style={{ padding: '1rem' }}>Rol / Yetki</th>
                                    <th style={{ padding: '1rem' }}>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }} className="table-row-hover">
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                                        <td style={{ padding: '1rem' }}>{u.email}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select 
                                                className="form-control" 
                                                value={u.role} 
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                style={{ padding: '0.4rem', fontSize: '0.875rem', width: 'auto', background: 'rgba(15,23,42,0.8)' }}
                                                disabled={u._id === user._id}
                                            >
                                                <option value="member">Üye</option>
                                                <option value="trainer">Eğitmen</option>
                                                <option value="admin">Yönetici</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button 
                                                className="btn btn-danger" 
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                                                onClick={() => handleDeleteUser(u._id)}
                                                disabled={u._id === user._id}
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            Aradığınız kriterlere uygun üye bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SEKME 3: Ders Atamaları */}
            {activeTab === 'enrollments' && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Ders Kayıtları ve Manuel Atama</h3>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ders veya eğitmen ara..." 
                            value={classSearch} 
                            onChange={(e) => setClassSearch(e.target.value)} 
                            style={{ maxWidth: '300px' }} 
                        />
                    </div>

                    <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                        {filteredClasses.map((cls) => {
                            // Find users not currently enrolled in this class to fill in the "manually enroll" selector
                            const enrolledIds = cls.enrolledMembers.map(member => member._id || member);
                            const eligibleUsers = usersList.filter(u => !enrolledIds.includes(u._id));

                            return (
                                <div key={cls._id} className="glass glass-panel glow-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{cls.name}</h3>
                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Eğitmen: {cls.trainer?.name || 'Belirtilmedi'}</p>
                                            </div>
                                            <span style={{ 
                                                background: cls.enrolledMembers.length >= cls.capacity ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                color: cls.enrolledMembers.length >= cls.capacity ? 'var(--danger)' : 'var(--success)',
                                                padding: '0.25rem 0.50rem',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700'
                                            }}>
                                                {cls.enrolledMembers.length} / {cls.capacity} Dolu
                                            </span>
                                        </div>

                                        {/* Enrolled members list */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h5 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Kayıtlı Üyeler ({cls.enrolledMembers.length})</h5>
                                            {cls.enrolledMembers.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                                    {cls.enrolledMembers.map((member) => (
                                                        <div key={member._id} style={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between', 
                                                            alignItems: 'center', 
                                                            background: 'rgba(255,255,255,0.02)',
                                                            padding: '0.4rem 0.75rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid rgba(255,255,255,0.03)'
                                                        }}>
                                                            <div style={{ minWidth: 0 }}>
                                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{member.name}</span>
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleAdminUnenroll(cls._id, member._id, member.name)}
                                                                style={{ 
                                                                    background: 'transparent', 
                                                                    border: 'none', 
                                                                    color: 'var(--danger)', 
                                                                    cursor: 'pointer',
                                                                    padding: '0.25rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                                title="Dersten Çıkar"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>Derse kayıtlı üye bulunmamaktadır.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Manual Enrollment Form */}
                                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                        <h5 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Manuel Üye Kaydet</h5>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <select 
                                                className="form-control"
                                                value={selectedUserToEnroll[cls._id] || ''}
                                                onChange={(e) => setSelectedUserToEnroll({ ...selectedUserToEnroll, [cls._id]: e.target.value })}
                                                style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', background: 'rgba(15,23,42,0.8)' }}
                                            >
                                                <option value="">-- Üye Seçin --</option>
                                                {eligibleUsers.map(u => (
                                                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                                ))}
                                            </select>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleAdminEnroll(cls._id)}
                                                style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}
                                                disabled={cls.enrolledMembers.length >= cls.capacity}
                                            >
                                                Ekle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredClasses.length === 0 && (
                            <p className="text-muted text-center" style={{ gridColumn: '1 / -1', padding: '2rem' }}>
                                Arama kriterlerine uygun ders bulunamadı.
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            {/* Custom hover styles for table rows */}
            <style>{`
                .table-row-hover:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
