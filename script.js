// Generate a random secret key
function generateSecret() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
        secret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return secret;
}

// Generate TOTP using jsSHA
function generateTOTP(secret) {
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = Math.floor(epoch / 30);
    const key = base32ToHex(secret);

    const shaObj = new jsSHA("SHA-1", "HEX");
    shaObj.setHMACKey(key, "HEX");
    shaObj.update(timeStep.toString(16).padStart(16, '0'));
    const hmac = shaObj.getHMAC("HEX");

    const offset = parseInt(hmac.slice(-1), 16);
    const otp = (parseInt(hmac.substr(offset * 2, 8), 16) & 0x7fffffff).toString();
    return otp.slice(-6);
}

// Convert Base32 to Hex
function base32ToHex(base32) {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = '';
    let hex = '';

    for (let i = 0; i < base32.length; i++) {
        const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 4 <= bits.length; i += 4) {
        hex += parseInt(bits.substr(i, 4), 2).toString(16);
    }
    return hex;
}

// Initialize app
const secret = generateSecret();
document.getElementById('secret').innerText = secret;

// Generate QR Code
const otpauth = `otpauth://totp/SampleApp?secret=${secret}&issuer=SampleApp`;
QRCode.toCanvas(document.getElementById('qrcode'), otpauth, function (error) {
    if (error) console.error(error);
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const userOTP = document.getElementById('otp').value;
    const generatedOTP = generateTOTP(secret);

    if (userOTP === generatedOTP) {
        document.getElementById('loginResult').innerText = 'Login Successful!';
        document.getElementById('loginResult').style.color = 'green';
    } else {
        document.getElementById('loginResult').innerText = 'Invalid OTP!';
        document.getElementById('loginResult').style.color = 'red';
    }
});