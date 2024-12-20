import React, { useState, useEffect } from "react";

const Notification = ({ message, type, show, onClose }) => {
  return (
    <div
      className={`notification-container ${show ? "show" : ""}`}
      style={{
        position: "fixed",
        top: "30px",
        right: "50px",
        background: type === "success"
          ? "linear-gradient(45deg, #4caf50, #8bc34a)"
          : (type === "error"
            ? "linear-gradient(45deg, #e53935, #e35d5b)"
            : "linear-gradient(45deg, #ff9800, #f57c00)"), // Thêm màu cho loại cảnh báo
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        zIndex: 1000,
      }}
    >
      <div
        className="circle-animation"
        style={{
          position: "absolute",
          top: "50%",
          left: "20px",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          height: "30px",
          width: "30px",
          backgroundImage: type === "success"
            ? "linear-gradient(#9b59b6, #84cdfa, #5ad1cd)"
            : (type === "error"
              ? "linear-gradient(#f44336, #ff6f61, #ff8a65)"
              : "linear-gradient(#ff9800, #f57c00)"), // Thêm màu cho loại cảnh báo
          animation: "rotate_3922 1.2s linear infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "10px",
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        ></div>
      </div>
      <p style={{ marginLeft: "30px", marginBottom: 0, paddingRight: '13px' }}>{message}</p>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "-3px",
          right: "-2px",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <style>
        {`
          @keyframes rotate_3922 {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Notification;
