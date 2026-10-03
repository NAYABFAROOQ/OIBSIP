import React, { useState } from 'react';

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  items = [],
  deliveryAddress = {},
  onPaymentSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('nayab@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('Nayab Farooq');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setProcessingStep('Connecting to Razorpay Secure Gateway (TLS 1.3)...');

    setTimeout(() => {
      setProcessingStep('Authorizing 3D-Secure 2.0 transaction...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Decreasing MongoDB inventory & verifying receipt...');
    }, 1800);

    setTimeout(() => {
      const generatedPayId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 6);
      setIsProcessing(false);
      setPaymentSuccess({
        id: generatedPayId,
        time: new Date().toLocaleTimeString(),
        method: selectedMethod.toUpperCase()
      });
    }, 2600);
  };

  const handleFinish = () => {
    if (paymentSuccess) {
      onPaymentSuccess(paymentSuccess.id);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 13, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={!isProcessing ? onClose : undefined}
    >
      <div
        style={{
          background: '#0e1726',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(37, 99, 235, 0.2)',
          overflow: 'hidden',
          color: '#ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay Brand Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.2rem',
                color: '#fff',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.5)'
              }}
            >
              R
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Razorpay <span style={{ fontSize: '0.7rem', background: '#3b82f6', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>TEST MODE</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>Nayab's Pizzeria • Sialkot</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Payable</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#38bdf8' }}>${amount.toFixed(2)}</div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {isProcessing ? (
            /* Processing Animation State */
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid rgba(59, 130, 246, 0.2)',
                  borderTop: '4px solid #38bdf8',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Processing Payment...</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', minHeight: '1.5rem' }}>{processingStep}</p>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem' }}>
                🔒 256-Bit SSL Encrypted • Do not refresh the page
              </div>
            </div>
          ) : paymentSuccess ? (
            /* Payment Success Screen */
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  color: '#34d399',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
                }}
              >
                ✓
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.4rem' }}>
                Payment Successful!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Your order is confirmed and sent to the woodfire kitchen.
              </p>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  textAlign: 'left',
                  fontSize: '0.88rem',
                  marginBottom: '1.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Razorpay Payment ID:</span>
                  <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{paymentSuccess.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Amount Paid:</span>
                  <strong style={{ color: '#34d399' }}>${amount.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Method:</span>
                  <span style={{ color: '#ffffff' }}>{paymentSuccess.method} (Instant)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Delivery To:</span>
                  <span style={{ color: '#ffffff' }}>{deliveryAddress.street || 'Sialkot'}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
                onClick={handleFinish}
              >
                Track Your Pizza in Real-Time ➔
              </button>
            </div>
          ) : (
            /* Method Selection & Checkout */
            <div>
              {/* Payment Methods Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  style={{
                    background: selectedMethod === 'upi' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedMethod === 'upi' ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '0.75rem 0.5rem',
                    color: selectedMethod === 'upi' ? '#60a5fa' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}
                >
                  📱 UPI / QR
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  style={{
                    background: selectedMethod === 'card' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedMethod === 'card' ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '0.75rem 0.5rem',
                    color: selectedMethod === 'card' ? '#60a5fa' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}
                >
                  💳 Card (Visa/MC)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  style={{
                    background: selectedMethod === 'netbanking' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedMethod === 'netbanking' ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '0.75rem 0.5rem',
                    color: selectedMethod === 'netbanking' ? '#60a5fa' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}
                >
                  🏦 Netbanking
                </button>
              </div>

              {/* UPI Tab */}
              {selectedMethod === 'upi' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      className="form-control"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {['@okhdfcbank', '@okaxis', '@paytm', '@ybl'].map((handle) => (
                      <span
                        key={handle}
                        onClick={() => setUpiId(`nayab${handle}`)}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#38bdf8'
                        }}
                      >
                        {handle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {selectedMethod === 'card' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Card Number</label>
                    <input
                      className="form-control"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Expiry (MM/YY)</label>
                      <input
                        className="form-control"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>CVV</label>
                      <input
                        className="form-control"
                        type="password"
                        maxLength="4"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking Tab */}
              {selectedMethod === 'netbanking' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                    Select Your Bank
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                      <div
                        key={bank}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.65rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer'
                        }}
                      >
                        🏦 {bank}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items Preview */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.3rem' }}>
                  <span>Items count:</span>
                  <span style={{ color: '#fff' }}>{items.length} pizzas</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Delivery to:</span>
                  <span style={{ color: '#fff' }}>{deliveryAddress.street || 'Sialkot'}, {deliveryAddress.city || 'Punjab'}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 18px rgba(37, 99, 235, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
                onClick={handleSimulatePayment}
              >
                <span>🔒 Pay ${amount.toFixed(2)} via Razorpay</span>
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  ⚡ Secured by Razorpay Payment Gateway
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
