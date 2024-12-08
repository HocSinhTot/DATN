import React from 'react';

const PopupuSer = ({ message, onClose, onConfirm }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '9999',
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '30px 40px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center',
                    width: '660px',
                    maxWidth: '90%',
                }}
            >
                <h3
                    style={{
                        marginBottom: '25px',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: '#333',
                        lineHeight: '1.5',
                    }}
                >
                    {message}
                </h3>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '30px',
                        gap: '20px',
                    }}
                >
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '12px 30px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#0056b3';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#007bff';
                        }}
                    >
                        Đồng ý
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            padding: '12px 30px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#a71d2a';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#dc3545';
                        }}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupuSer;
