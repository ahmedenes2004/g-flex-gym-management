import React from 'react';

const CreditCard = ({ cardNumber = '', cardName = '', expiry = '', cvv = '', focused = '' }) => {
    // Detect card type
    const getCardType = (num) => {
        if (num.startsWith('4')) return 'VISA';
        if (num.startsWith('5')) return 'MASTERCARD';
        return 'G-FLEX CARD';
    };

    // Format number with spaces
    const formatCardNumber = (num) => {
        const clean = num.replace(/\D/g, '');
        const pad = clean.padEnd(16, '•');
        return `${pad.slice(0, 4)} ${pad.slice(4, 8)} ${pad.slice(8, 12)} ${pad.slice(12, 16)}`;
    };

    const isFlipped = focused === 'cvv';

    return (
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                            width: '42px', 
                            height: '32px', 
                            borderRadius: '6px',
                            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)'
                        }}></div> {/* Card Chip */}
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Outfit, sans-serif', letterSpacing: '1px' }}>
                            {getCardType(cardNumber)}
                        </span>
                    </div>
                    <div style={{ 
                        fontSize: '1.35rem', 
                        letterSpacing: '3px', 
                        margin: '1.5rem 0', 
                        fontFamily: 'monospace', 
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        textAlign: 'center'
                    }}>
                        {formatCardNumber(cardNumber)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>KART SAHİBİ</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '500', minHeight: '1.2rem', letterSpacing: '0.5px' }}>
                                {cardName.toUpperCase() || 'AD SOYAD'}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>SKT</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.5px' }}>
                                {expiry || 'AA/YY'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back" style={{ padding: '1rem 0' }}>
                    <div style={{ width: '100%', height: '40px', background: '#000', marginTop: '10px' }}></div>
                    <div style={{ padding: '0 1.5rem', marginTop: '15px' }}>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', textAlign: 'right', marginRight: '5px' }}>CVV</div>
                        <div style={{ 
                            background: '#ffffff', 
                            color: '#000000', 
                            textAlign: 'right', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            marginTop: '5px',
                            letterSpacing: '2px',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            {cvv || '•••'}
                        </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '20px', padding: '0 1.5rem', lineHeight: '1.3' }}>
                        Bu kart sadece G-Flex Gym üyeliği ödeme simülasyonu için kullanılabilir. Gerçek bir ödeme gerçekleşmeyecektir.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCard;
