import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CreditCard from '../components/CreditCard';
import { useNotification } from '../components/Notification';
import { API_URL } from '../config';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    const [amount, setAmount] = useState('30');
    const [plan, setPlan] = useState('Monthly');

    // Credit Card Form States
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [focused, setFocused] = useState('');

    // Selected Invoice Modal State
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const fetchPayments = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/payments`, config);
            setPayments(data);
        } catch (error) {
            console.error('Ödemeler yüklenirken hata', error);
            showNotification('Ödeme geçmişi yüklenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Set prices automatically when plan changes
    useEffect(() => {
        if (plan === 'Monthly') setAmount('30');
        else if (plan === 'Quarterly') setAmount('80');
        else if (plan === 'Yearly') setAmount('280');
    }, [plan]);

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        setCardNumber(value);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        setExpiry(value.slice(0, 5));
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
        setCvv(value);
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        // Card validation
        if (cardNumber.length !== 16) {
            showNotification('Lütfen 16 haneli kredi kartı numaranızı girin.', 'error');
            return;
        }
        if (!cardName.trim()) {
            showNotification('Lütfen kart sahibinin adını girin.', 'error');
            return;
        }
        if (!expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
            showNotification('Lütfen geçerli son kullanma tarihi girin (AA/YY).', 'error');
            return;
        }
        if (cvv.length !== 3) {
            showNotification('Lütfen 3 haneli CVV numarasını girin.', 'error');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/payments`, { amount: Number(amount), plan }, config);
            showNotification('Ödeme başarıyla tamamlandı! Üyeliğiniz güncellendi.', 'success');
            
            // Reset fields
            setCardNumber('');
            setCardName('');
            setExpiry('');
            setCvv('');
            setFocused('');
            
            fetchPayments();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Ödeme sırasında hata oluştu.', 'error');
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'Completed': return 'Tamamlandı';
            case 'Pending': return 'Bekliyor';
            case 'Failed': return 'Başarısız';
            default: return status;
        }
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
            <h2 className="mb-4 text-gradient">Ödemeler ve Planlar</h2>
            <div className="grid grid-cols-2" style={{ alignItems: 'start', gap: '2rem' }}>
                {/* Payment Form Side */}
                <div>
                    <h3 className="mb-3">Yeni Üyelik Satın Al</h3>
                    <div className="glass glass-panel">
                        <CreditCard 
                            cardNumber={cardNumber}
                            cardName={cardName}
                            expiry={expiry}
                            cvv={cvv}
                            focused={focused}
                        />
                        <form onSubmit={handlePayment}>
                            <div className="form-group">
                                <label className="form-label">Üyelik Planı</label>
                                <select className="form-control" value={plan} onChange={(e) => setPlan(e.target.value)}>
                                    <option value="Monthly">Aylık Plan ($30 / Ay)</option>
                                    <option value="Quarterly">3 Aylık Plan ($80 / Toplam)</option>
                                    <option value="Yearly">Yıllık Plan ($280 / Yıl)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tutar ($)</label>
                                <input type="number" className="form-control" value={amount} readOnly style={{ opacity: 0.8, background: 'rgba(255,255,255,0.05)' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kart Numarası</label>
                                <input 
                                    type="text" 
                                    placeholder="•••• •••• •••• ••••"
                                    className="form-control" 
                                    value={cardNumber} 
                                    onChange={handleCardNumberChange}
                                    onFocus={() => setFocused('cardNumber')}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kart Sahibi</label>
                                <input 
                                    type="text" 
                                    placeholder="AD SOYAD"
                                    className="form-control" 
                                    value={cardName} 
                                    onChange={e => setCardName(e.target.value)}
                                    onFocus={() => setFocused('cardName')}
                                    required 
                                />
                            </div>
                            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Son Kullanma (AA/YY)</label>
                                    <input 
                                        type="text" 
                                        placeholder="AA/YY"
                                        className="form-control" 
                                        value={expiry} 
                                        onChange={handleExpiryChange}
                                        onFocus={() => setFocused('expiry')}
                                        required 
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">CVV</label>
                                    <input 
                                        type="password" 
                                        placeholder="•••"
                                        className="form-control" 
                                        value={cvv} 
                                        onChange={handleCvvChange}
                                        onFocus={() => setFocused('cvv')}
                                        onBlur={() => setFocused('')}
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Güvenle Öde</button>
                        </form>
                    </div>
                </div>

                {/* History Side */}
                <div>
                    <h3 className="mb-3">Ödeme Geçmişi</h3>
                    {loading ? <p>Yükleniyor...</p> : (
                        <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
                            {payments.map(payment => (
                                <div key={payment._id} className="glass glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--success)', fontWeight: 'bold' }}>${payment.amount}</h4>
                                        <p className="text-muted text-sm">{payment.plan === 'Monthly' ? 'Aylık' : (payment.plan === 'Quarterly' ? '3 Aylık' : 'Yıllık')} Plan</p>
                                        {user.role === 'admin' && <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>Üye: {payment.user?.name}</p>}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ 
                                            background: 'rgba(16, 185, 129, 0.15)', 
                                            color: 'var(--success)', 
                                            padding: '0.25rem 0.5rem', 
                                            borderRadius: '6px', 
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>{getStatusText(payment.status)}</span>
                                        <p className="text-muted text-sm mt-2" style={{ fontSize: '0.8rem' }}>
                                            {new Date(payment.paymentDate).toLocaleDateString('tr-TR')}
                                        </p>
                                        <button 
                                            className="btn" 
                                            style={{ 
                                                padding: '0.2rem 0.6rem', 
                                                fontSize: '0.75rem', 
                                                marginTop: '0.5rem', 
                                                background: 'rgba(99, 102, 241, 0.1)', 
                                                color: 'var(--primary)',
                                                border: '1px solid rgba(99, 102, 241, 0.2)'
                                            }}
                                            onClick={() => setSelectedInvoice(payment)}
                                        >
                                            Faturayı Gör
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {payments.length === 0 && <p className="text-muted">Kayıtlı ödeme geçmişi bulunamadı.</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Invoice Print Simulation Modal */}
            {selectedInvoice && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(2, 6, 23, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }}>
                    <div className="glass glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-dark)' }}>
                        <div id="print-section" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                <div>
                                    <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>G-FLEX GYM</h2>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>G-Flex Fitness HQ, İstanbul</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h3 style={{ fontSize: '1.2rem' }}>FATURA</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No: INV-{selectedInvoice._id.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>

                            <div style={{ margin: '1.5rem 0', fontSize: '0.9rem' }}>
                                <p style={{ marginBottom: '0.25rem' }}><strong>Müşteri:</strong> {selectedInvoice.user?.name || user.name}</p>
                                <p style={{ marginBottom: '0.25rem' }}><strong>E-posta:</strong> {selectedInvoice.user?.email || user.email}</p>
                                <p style={{ marginBottom: '0.25rem' }}><strong>Tarih:</strong> {new Date(selectedInvoice.paymentDate).toLocaleString('tr-TR')}</p>
                                <p style={{ marginBottom: '0.25rem' }}><strong>Durum:</strong> <span style={{ color: 'var(--success)' }}>Ödendi</span></p>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text-muted)' }}>Açıklama</th>
                                        <th style={{ textAlign: 'right', padding: '0.5rem 0', color: 'var(--text-muted)' }}>Tutar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem 0' }}>
                                            G-Flex Gym {selectedInvoice.plan === 'Monthly' ? 'Aylık' : (selectedInvoice.plan === 'Quarterly' ? '3 Aylık' : 'Yıllık')} Üyelik Paketi
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>${selectedInvoice.amount}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', fontWeight: 'bold' }}>
                                <span>Toplam Tutar:</span>
                                <span style={{ fontSize: '1.4rem', color: 'var(--success)' }}>${selectedInvoice.amount}</span>
                            </div>
                            
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem', fontStyle: 'italic' }}>
                                Bu bir bilgisayar çıktısıdır ve ödeme onay belgesi olarak geçerlidir.
                            </p>
                        </div>

                        <div className="d-flex mt-4" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                            <button className="btn" onClick={() => setSelectedInvoice(null)} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>Kapat</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>Yazdır / PDF</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Payments;
