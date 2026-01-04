<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background-color: #f9f9f9;
        }
        .card {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .logo {
            font-size: 24px;
            font-weight: 900;
            color: #2563eb;
            margin-bottom: 20px;
            text-align: center;
        }
        .title {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        .otp-box {
            background-color: #eff6ff;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #2563eb;
            margin: 30px 0;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo">SecondChance</div>
            <div class="title">Verify Your Account</div>
            <p style="color: #4b5563; line-height: 1.6; text-align: center;">
                Welcome to the marketplace! Use the code below to complete your registration.
            </p>
            <div class="otp-box">{{ $otp }}</div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                This code will expire in 10 minutes. If you didn't request this, please ignore this email.
            </p>
        </div>
        <div class="footer">
            &copy; 2026 SecondChance Marketplace. Safe & Secure.
        </div>
    </div>
</body>
</html>
