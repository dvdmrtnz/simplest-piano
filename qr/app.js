// Select the video element and the result display div
const video = document.getElementById('video');
const resultDiv = document.getElementById('result');

// Set the path for the QRScanner worker
QRScanner.WORKER_PATH = 'https://unpkg.com/qr-scanner/qr-scanner-worker.min.js';

// Create a QRScanner instance using the video element and a callback function for successful QR code scanning
const qrScanner = new QRScanner(video, result => {
    console.log('QR Code Scanned: ', result);
    resultDiv.innerHTML = `QR Code: <strong>${result}</strong>`;  // Display the result in the result div
    qrScanner.stop();  // Stop the scanner after detecting a QR code (optional, depends on your use case)
});

// Start scanning once the user allows camera access
qrScanner.start().catch(err => {
    console.error(err);
    resultDiv.innerHTML = 'Error: Unable to access the camera.';
});

// Handle any potential QR decoding errors
qrScanner.onDecodeError = error => {
    console.error(error);
};
