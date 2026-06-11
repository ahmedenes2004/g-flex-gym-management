import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import { API_URL } from '../config';

const MyClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Hepsi');
    const [selectedClass, setSelectedClass] = useState(null); // For detail modal
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();

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

    const fetchMyClasses = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/classes`);
            // Filter to only user's classes
            const userClasses = data.filter(cls => 
                cls.enrolledMembers.some(member => {
                    const memberId = member._id || member;
                    return memberId === user._id;
                })
            );
            setClasses(userClasses);
        } catch (error) {
            console.error('Kayıtlı dersler yüklenirken hata oluştu', error);
            showNotification('Kayıtlı dersleriniz yüklenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyClasses();
    }, []);

    const handleUnenroll = async (e, id) => {
        e.stopPropagation(); // prevent modal opening when clicking unenroll
        if (window.confirm('Bu dersten kaydınızı silmek istediğinize emin misiniz?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`${API_URL}/api/classes/${id}/unenroll`, {}, config);
                showNotification('Dersten kaydınız başarıyla silindi.', 'success');
                if (selectedClass && selectedClass._id === id) {
                    setSelectedClass(null);
                }
                fetchMyClasses();
            } catch (error) {
                showNotification(error.response?.data?.message || 'İşlem sırasında hata oluştu.', 'error');
            }
        }
    };

    // Filter by category
    const filteredClasses = classes.filter(cls => {
        if (selectedCategory === 'Hepsi') return true;
        return cls.category === selectedCategory;
    });

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

    // Generated static premium details content for classes based on category
    const getClassContentDetails = (cls) => {
        const cat = cls.category || 'Fitness';
        const base = {
            duration: '45 - 60 Dakika',
            intensity: 'Orta Seviye',
            calories: '400 - 600 kcal',
            requirements: ['Spor ayakkabısı', 'Temiz havlu', 'Matara su'],
            exercises: ['Genel Vücut Mobilizasyonu (Isınma)', 'Ana Set Çalışması', 'Soğuma ve Statik Esneme'],
            nutritionTips: 'Dersten 1.5 - 2 saat önce karbonhidrat ve protein ağırlıklı hafif bir öğün tüketin. Antrenman sırasında bol yudumlu su tüketin.'
        };

        if (cat === 'Fitness') {
            return {
                ...base,
                intensity: 'Orta / İleri Seviye',
                calories: '350 - 500 kcal',
                exercises: [
                    'Isınma (Dinamik Esnemeler ve Bar Boş Isınma Serisi) - 10 Dk',
                    'Squat / Bench Press / Deadlift (Bileşik Güç Çalışması) - 4 Set x 8 Tekrar',
                    'Destekleyici İzole Egzersizler (Dumbbell Row, Bicep Curl, Tricep Extension) - 3 Set x 12 Tekrar',
                    'Karın ve Core Sıkılaştırma Plank Serisi - 3 Set x 45 Sn',
                    'Statik Esneme ve Soğuma - 5 Dk'
                ],
                requirements: ['Fitness eldiveni (isteğe bağlı)', 'Havlunuz', 'Suluğunuz']
            };
        } else if (cat === 'Kardiyo & Koşu') {
            return {
                ...base,
                intensity: 'Yüksek Seviye (HIIT)',
                calories: '550 - 750 kcal',
                exercises: [
                    'Düşük Tempolu Isınma Koşusu - 5 Dk',
                    'Interval Sprint Çalışması (30 Sn Maksimum Hız, 60 Sn Hafif Tempo Yürüyüş) - 10 Tur',
                    'Eğimli Tırmanış Dayanıklılık Serisi (%6-8 Eğimde Sabit Tempo) - 10 Dk',
                    'Soğuma Koşusu ve Düşük Nabız Yürüyüşü - 5 Dk',
                    'Bacak Esnetmeleri - 5 Dk'
                ],
                requirements: ['Yastıklamalı koşu ayakkabısı', 'Su', 'Kişisel Havlu']
            };
        } else if (cat === 'İp Atlama') {
            return {
                ...base,
                intensity: 'Orta Seviye',
                calories: '500 - 700 kcal',
                exercises: [
                    'Ayak Bileği ve Bilek Mobilizasyonu - 5 Dk',
                    'Temel İki Ayak Sıçrama Ritim Çalışması - 5 Set x 2 Dk',
                    'Koşar Adım İp Atlama ve Hız Denemeleri - 4 Set x 1.5 Dk',
                    'Alternatif Bacak / Tek Ayak Geçişleri - 3 Set x 1 Dk',
                    'Double Unders (Çift Çevirme) Denemeleri - 5 Dk',
                    'Alt Bacak (Calf) Esnetme ve Soğuma - 5 Dk'
                ],
                requirements: ['Rulmanlı atlama ipi', 'Esnek spor ayakkabı', 'Su']
            };
        } else if (cat === 'Pilates') {
            return {
                ...base,
                intensity: 'Başlangıç / Orta Seviye',
                calories: '250 - 380 kcal',
                exercises: [
                    'Derin Pilates Nefesi ve Omurga Mobilizasyonu - 10 Dk',
                    'The Hundred (Yüzlük Karın Aktivasyonu) - 100 Nabız Atışı',
                    'Leg Circles & Single Leg Stretch (Core & Bacak Kontrolü) - 3 Set x 12 Tekrar',
                    'Shoulder Bridge (Kalça Köprüsü ve Omurga Eklemlenmesi) - 3 Set x 15 Tekrar',
                    'Kedi-Deve Esnemesi ve Omurga Rahatlatma Serisi - 5 Dk'
                ],
                requirements: ['Pilates çorabı (kaymaz)', 'Rahat kıyafetler', 'Su']
            };
        } else if (cat === 'Yoga') {
            return {
                ...base,
                intensity: 'Hafif / Orta Seviye',
                calories: '180 - 280 kcal',
                exercises: [
                    'Pranayama (Nefes Çalışması) ve Odaklanma - 5 Dk',
                    'Surya Namaskar (Güneşe Selam A ve B Akışı) - 5 Tur',
                    'Denge ve Ayaktaki Asanalar (Savaşçı 1-2, Ağaç Duruşu) - 15 Dk',
                    'Derin Esneme ve Oturan Pozlar (Güvercin Duruşu, Paschimottanasana) - 15 Dk',
                    'Şavasana (Derin Gevşeme ve Meditasyon) - 10 Dk'
                ],
                requirements: ['Yoga matı (stüdyoda mevcuttur)', 'Esnek kıyafetler']
            };
        } else if (cat === 'CrossFit') {
            return {
                ...base,
                intensity: 'Çok Yüksek Seviye (Meydan Okuma)',
                calories: '600 - 850 kcal',
                exercises: [
                    'Dinamik Isınma, Eklem Hareketliliği ve Barbell Isınması - 10 Dk',
                    'Skill / Teknik Çalışması (Kettlebell Swing & Thruster Formu) - 10 Dk',
                    'WOD (Antrenman): 15 Dk AMRAP (As Many Rounds As Possible) - 15 Kettlebell Swing, 10 Thrusters, 8 Burpees',
                    'Halter / Jimnastik Teknik Çalışması - 10 Dk',
                    'Soğuma ve Derin Fasiyal Esneme - 5 Dk'
                ],
                requirements: ['Bilek bandajı / CrossFit eldiveni', 'Kişisel havlu', 'Büyük boy matara']
            };
        } else if (cat === 'Boks & Kickboks') {
            return {
                ...base,
                intensity: 'Yüksek Seviye',
                calories: '600 - 800 kcal',
                exercises: [
                    'İp Atlama ve Gölge Boksu Isınması - 10 Dk',
                    'Yumruk ve Tekme Teknik Kombinasyon Eğitimi (Gard, Sol-Sağ Direk, Kroşe, Dış Tekme) - 15 Dk',
                    'Lapa (Pad) ve Torba Çalışması (Hız ve Güç Odaklı Kombinasyonlar) - 5 Raunt x 3 Dk',
                    'Karın ve Kondisyon Bitirici (Core Finisher) - 10 Dk',
                    'Statik Esneme ve Soğuma - 5 Dk'
                ],
                requirements: ['Boks bandajı (el sargısı)', 'Boks eldiveni (10-14 oz)', 'Temiz havlu']
            };
        } else if (cat === 'Spinning') {
            return {
                ...base,
                intensity: 'Yüksek Seviye',
                calories: '500 - 750 kcal',
                exercises: [
                    'Düşük Direnç Isınma Pedallaması - 5 Dk',
                    'Düz Yol Temposu ve Ritim Koruma (90-100 RPM) - 10 Dk',
                    'Hill Climb (Ayakta Dirençli Tırmanış Simülasyonu) - 15 Dk',
                    'Sprints (Yüksek Hızda Pedal Basma Serileri) - 30 Sn Sprint / 60 Sn Dinlenme (8 Tur)',
                    'Cool Down (Soğuma) ve Bisiklet Üzerinde Esneme - 5 Dk'
                ],
                requirements: ['Spinning ayakkabısı (isteğe bağlı)', 'Küçük yüz havlusu', 'Bolca su']
            };
        }
        return base;
    };

    return (
        <div className="animate-fade-in" style={{ marginTop: '1rem' }}>
            <div className="d-flex justify-between align-center mb-4">
                <div>
                    <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Kayıtlı Derslerim</h2>
                    <p className="text-muted">Katılmakta olduğunuz kişisel spor derslerinizi görüntüleyin, içerik detaylarını inceleyin.</p>
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="mb-4">
                <span className="form-label" style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Kategoriye Göre Filtrele</span>
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
                <>
                    <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                        {filteredClasses.map((cls) => {
                            const styles = getCategoryStyles(cls.category);
                            return (
                                <div 
                                    key={cls._id} 
                                    className="glass glow-card" 
                                    style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'space-between', 
                                        padding: '1.75rem', 
                                        border: `1px solid ${styles.border}`,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSelectedClass(cls)}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <span style={{ 
                                                background: styles.bg, 
                                                color: styles.color, 
                                                padding: '0.3rem 0.8rem', 
                                                borderRadius: '30px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: '700',
                                                border: `1px solid ${styles.border}`
                                            }}>
                                                {cls.category || 'Fitness'}
                                            </span>
                                            <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Detayları Gör →
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
                                                <span className="text-muted">Tarih:</span>
                                                <strong style={{ color: '#fff' }}>{new Date(cls.schedule).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })}</strong>
                                            </p>
                                            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span className="text-muted">Saat:</span>
                                                <strong style={{ color: '#fff' }}>{new Date(cls.schedule).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-4" style={{ gap: '0.5rem' }}>
                                        <button 
                                            className="btn btn-danger" 
                                            style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                                            onClick={(e) => handleUnenroll(e, cls._id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Kaydı Sil
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredClasses.length === 0 && (
                            <div className="glass glass-panel text-center text-muted" style={{ gridColumn: '1/-1', padding: '4rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Kayıtlı Dersiniz Bulunmuyor</p>
                                <p className="text-muted" style={{ fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                                    Henüz bu kategoride hiçbir derse kayıt yaptırmadınız. Ders Kataloğu sayfasından kendinize uygun bir ders seçebilirsiniz.
                                </p>
                                <a href="/classes" className="btn btn-primary" style={{ textDecoration: 'none' }}>Ders Kataloğuna Git</a>
                            </div>
                        )}
                    </div>

                    {/* Class Detail Modal */}
                    {selectedClass && (() => {
                        const styles = getCategoryStyles(selectedClass.category);
                        const details = getClassContentDetails(selectedClass);
                        return (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(2, 6, 23, 0.85)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10000,
                                padding: '1.5rem',
                                animation: 'fadeInOverlay 0.2s ease forwards'
                            }} onClick={() => setSelectedClass(null)}>
                                <div className="glass glass-panel" style={{
                                    maxWidth: '650px',
                                    width: '100%',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    position: 'relative',
                                    background: 'var(--bg-darker)',
                                    borderColor: styles.border,
                                    padding: '2.5rem',
                                    boxShadow: `0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px ${styles.bg}`
                                }} onClick={e => e.stopPropagation()}>
                                    
                                    {/* Close button */}
                                    <button 
                                        onClick={() => setSelectedClass(null)} 
                                        style={{
                                            position: 'absolute',
                                            top: '1.25rem',
                                            right: '1.25rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        ✕
                                    </button>

                                    {/* Header */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <span style={{ 
                                            background: styles.bg, 
                                            color: styles.color, 
                                            padding: '0.3rem 0.8rem', 
                                            borderRadius: '30px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: '700',
                                            border: `1px solid ${styles.border}`,
                                            display: 'inline-block',
                                            marginBottom: '0.75rem'
                                        }}>
                                            {selectedClass.category}
                                        </span>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{selectedClass.name}</h2>
                                        <p className="text-muted mt-2">{selectedClass.description}</p>
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-3" style={{ gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '1.5rem', paddingBottom: '1.5rem' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Süre</span>
                                            <strong style={{ color: '#fff' }}>{details.duration}</strong>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Zorluk</span>
                                            <strong style={{ color: styles.color }}>{details.intensity}</strong>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Ortalama Yakım</span>
                                            <strong style={{ color: '#10b981' }}>{details.calories}</strong>
                                        </div>
                                    </div>

                                    {/* Exercises / Program */}
                                    <div style={{ marginBottom: '1.75rem' }}>
                                        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            📋 Antrenman Akışı & Hareketler
                                        </h4>
                                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: 0 }}>
                                            {details.exercises.map((item, idx) => (
                                                <li key={idx} style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'flex-start', 
                                                    gap: '0.75rem', 
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text-main)',
                                                    background: 'rgba(255,255,255,0.01)',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px'
                                                }}>
                                                    <span style={{ color: styles.color, fontWeight: 'bold' }}>#{idx + 1}</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Nutrition Tip */}
                                    <div style={{ 
                                        background: 'rgba(99, 102, 241, 0.05)', 
                                        border: '1px solid rgba(99, 102, 241, 0.15)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        marginBottom: '1.75rem'
                                    }}>
                                        <h4 style={{ color: 'var(--primary)', fontSize: '0.95rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            💡 Beslenme & Hidrasyon Tavsiyesi
                                        </h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                            {details.nutritionTips}
                                        </p>
                                    </div>

                                    {/* What to Bring / Requirements */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem' }}>🎒 Yanınızda Getirmeniz Gerekenler</h4>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {details.requirements.map((req, idx) => (
                                                <span key={idx} style={{ 
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    color: 'var(--text-main)', 
                                                    padding: '0.4rem 0.8rem', 
                                                    borderRadius: '8px', 
                                                    fontSize: '0.8rem',
                                                    border: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    ✓ {req}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Unenroll and Info Footer */}
                                    <div className="d-flex justify-between align-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <div><strong>Eğitmen:</strong> {selectedClass.trainer?.name}</div>
                                            <div><strong>Zaman:</strong> {DAY_MAP[new Date(selectedClass.schedule).getDay()]} saat {new Date(selectedClass.schedule).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                        <button 
                                            className="btn btn-danger" 
                                            style={{ padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            onClick={(e) => handleUnenroll(e, selectedClass._id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Kaydı İptal Et
                                        </button>
                                    </div>

                                </div>
                            </div>
                        );
                    })()}
                </>
            )}
        </div>
    );
};

export default MyClasses;
