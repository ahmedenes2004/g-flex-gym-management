import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [statsRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/stats', config),
                    axios.get('http://localhost:5000/api/users', config)
                ]);
                setStats(statsRes.data);
                setUsersList(usersRes.data);
            } catch (error) {
                console.error("Veriler alınamadı", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/users/${userId}/role`, { role: newRole }, config);
            
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
                await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
                setUsersList(usersList.filter(u => u._id !== userId));
                alert('Kullanıcı başarıyla silindi!');
            } catch (error) {
                alert(error.response?.data?.message || 'Silme işlemi başarısız');
            }
        }
    };

    if (loading) return <div className="text-center mt-4">Yükleniyor...</div>;

    return (
        <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 className="mb-4 text-gradient">Admin Paneli</h1>

            {stats && (
                <div className="mb-4">
                    <h3 className="mb-3">Sistem Özetleri</h3>
                    <div className="grid grid-cols-3 mb-4">
                        <div className="glass glass-panel text-center">
                            <h4>Toplam Üye</h4>
                            <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>{stats.totalUsers}</p>
                        </div>
                        <div className="glass glass-panel text-center">
                            <h4>Toplam Kazanç</h4>
                            <p style={{ fontSize: '2rem', color: 'var(--success)' }}>${stats.totalRevenue}</p>
                        </div>
                        <div className="glass glass-panel text-center">
                            <h4>Açılan Dersler</h4>
                            <p style={{ fontSize: '2rem', color: '#c084fc' }}>{stats.totalClasses}</p>
                        </div>
                    </div>

                    <div className="glass glass-panel mb-4">
                        <h4 className="mb-3">Ders Popülerliği</h4>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.classPopularity}>
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                    <Bar dataKey="enrolled" name="Kayıtlı Kişi" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass glass-panel">
                <h3 className="mb-3">Kullanıcı Yönetimi</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem' }}>İsim</th>
                                <th style={{ padding: '1rem' }}>E-posta</th>
                                <th style={{ padding: '1rem' }}>Kayıt Tarihi</th>
                                <th style={{ padding: '1rem' }}>Yetki</th>
                                <th style={{ padding: '1rem' }}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map((u) => (
                                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{u.name}</td>
                                    <td style={{ padding: '1rem' }}>{u.email}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select 
                                            className="form-control" 
                                            value={u.role} 
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            style={{ padding: '0.4rem', fontSize: '0.9rem', width: 'auto' }}
                                            disabled={u._id === user._id} // Admin cannot change their own role here safely
                                        >
                                            <option value="member">Üye (Member)</option>
                                            <option value="trainer">Eğitmen (Trainer)</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button 
                                            className="btn btn-danger" 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            onClick={() => handleDeleteUser(u._id)}
                                            disabled={u._id === user._id} // Admin cannot delete themselves here
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
