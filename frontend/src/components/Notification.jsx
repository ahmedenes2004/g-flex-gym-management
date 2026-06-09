import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info') => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type, exit: false }]);
        
        // Start exit animation after 3 seconds
        setTimeout(() => {
            setNotifications((prev) => 
                prev.map((n) => n.id === id ? { ...n, exit: true } : n)
            );
            // Remove from state after exit animation finishes
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 300);
        }, 3000);
    }, []);

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="toast-container">
                {notifications.map((n) => (
                    <div 
                        key={n.id} 
                        className={`toast toast-${n.type} ${n.exit ? 'toast-exit' : ''}`}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {n.type === 'success' && <span style={{ color: 'var(--success)' }}>✔</span>}
                            {n.type === 'error' && <span style={{ color: 'var(--danger)' }}>✖</span>}
                            {n.type === 'info' && <span style={{ color: 'var(--primary)' }}>ℹ</span>}
                            <span>{n.message}</span>
                        </div>
                        <button 
                            onClick={() => removeNotification(n.id)} 
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: 'rgba(255,255,255,0.6)', 
                                cursor: 'pointer', 
                                marginLeft: '1rem',
                                fontSize: '1.2rem',
                                lineHeight: 1
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
