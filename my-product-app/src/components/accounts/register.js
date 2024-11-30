import React, { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        gender: 'male',
        dob: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const isWeakPassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Kiểm tra tên người dùng không để trống
        if (!formData.username.trim()) {
            setError("Tên người dùng không được để trống!");
            return;
        }
    
        // Kiểm tra email có đúng định dạng không
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(formData.email)) {
            setError("Email không hợp lệ!");
            return;
        }
    
        // Kiểm tra số điện thoại có hợp lệ không (giả sử số điện thoại phải là 10 chữ số)
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(formData.phone)) {
            setError("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số.");
            return;
        }
    
        // Kiểm tra địa chỉ không để trống
        if (!formData.address.trim()) {
            setError("Địa chỉ không được để trống!");
            return;
        }
    
        // Kiểm tra ngày sinh không phải là ngày tương lai
        const dob = new Date(formData.dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đảm bảo chỉ so sánh ngày, không tính đến giờ
        if (dob > today) {
            setError("Ngày sinh không thể là ngày tương lai!");
            return;
        }
    
        // Kiểm tra tuổi lớn hơn hoặc bằng 16
        const age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (age < 16) {
            setError("Bạn phải lớn hơn 16 tuổi để đăng ký.");
            return;
        }
    
        // Kiểm tra mật khẩu có khớp không
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu không khớp!");
            return;
        }
        if (isWeakPassword(formData.password)) {
            setError("Mật khẩu yếu. Mật khẩu cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setSuccess('Đăng ký thành công! Hãy kiểm tra email của bạn.');
                setError('');
            } else {
                setError(result.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
                setSuccess('');
            }
        } catch (err) {
            setError('Không thể kết nối tới máy chủ.');
            setSuccess('');
        }
    };
    
    

    return (
        <div style={{
            background: 'radial-gradient(ellipse at bottom, #3a6e71 0%, #1a2b3d 100%)',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            margin: 0,
            position: 'relative'
        }}>
            <div style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                maxWidth: '700px',
                width: '100%',
                zIndex: 10,
                transition: 'transform 0.3s ease-in-out'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng ký</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="username" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tên người dùng:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Mật khẩu:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="confirm-password" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Xác nhận mật khẩu:</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="phone" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Số điện thoại:</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="address" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Địa chỉ:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="gender" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Giới tính:</label>
                            <select
                                id="gender"
                                name="gender"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="dob" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Ngày sinh:</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                style={{
                                    width: '100%',
                                    height: '43%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s',
                                    color: 'black'  // Đổi màu chữ thành đen
                                }}
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background-color 0.3s'
                    }}>Đăng ký</button>
                    <div style={{ paddingTop: '20px' }}>
                        <a href="/login" style={{
                            textDecoration: 'none',
                            color: '#fff',
                            fontSize: '14px',
                            marginTop: '10px',
                            display: 'inline-block'
                        }}>Quay lại đăng nhập</a>
                    </div>
                    {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginTop: '20px' }}>{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default Register;
