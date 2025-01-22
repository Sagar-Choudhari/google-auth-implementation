// In-memory storage for user secrets
const userSecrets = {};

// Generate a unique secret key
function generateSecret() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 character set
    let secret = '';
    for (let i = 0; i < 16; i++) {
        secret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return secret;
}

// Generate QR Code for TOTP
document.getElementById('generateQR').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Please enter a username.');
        return;
    }

    // Generate a unique secret for the user
    const secret = generateSecret();
    userSecrets[username] = secret;

    // Create the otpauth URL
    const otpauth = `otpauth://totp/SampleApp:${username}?secret=${secret}&issuer=SampleApp`;

    // Generate and display the QR code
    QRCode.toCanvas(document.getElementById('qrcode'), otpauth, (error) => {
        if (error) {
            console.error('Error generating QR code:', error);
            return;
        }
        console.log('QR code generated successfully!');
    });

    // Display the secret for reference
    document.getElementById('secret').innerText = `Your Secret Key: ${secret}`;
});

// Validate OTP during login
document.getElementById('validateOTP').addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const otp = document.getElementById('otp').value.trim();

    if (!username || !otp) {
        alert('Please enter both username and OTP.');
        return;
    }

    // Retrieve the secret for the user
    const secret = userSecrets[username];
    if (!secret) {
        document.getElementById('loginMessage').innerText = 'User not registered.';
        return;
    }

    // Validate the OTP using otplib
    const isValid = otplib.authenticator.check(otp, secret);
    if (isValid) {
        document.getElementById('loginMessage').innerText = 'Login successful!';
    } else {
        document.getElementById('loginMessage').innerText = 'Invalid OTP.';
    }
});


const secret = 'your-secret-key';
const otp = otplib.authenticator.generate(secret); // Generate an OTP
const isValid = otplib.authenticator.check(otp, secret); // Validate the OTP
console.log('Generated OTP:', otp);
console.log('Is OTP valid:', isValid);