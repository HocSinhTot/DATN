<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Thanh toán thành công</title>
<style>
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    margin: 0;
}

.success-message {
    font-size: 24px;
    padding: 20px;
    background-color: #28a745;
    color: white;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
</head>
<body>
    <div class="success-message">
        Thanh toán thành công
    </div>
</body>
</html>
