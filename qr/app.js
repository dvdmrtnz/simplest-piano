const video = document.getElementById('video');
const resultDiv = document.getElementById('result');

// Set the path for the QRScanner worker
QRScanner.WORKER_PATH = 'https://unpkg.com/qr-scanner/qr-scanner-worker.min.js';

// Request the camera stream using getUserMedia
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;  // Set the video source to the camera stream

        // Create a QRScanner instance and start scanning
        const qrScanner = new QRScanner(video, result => {
            console.log('QR Code Scanned:', result);
            resultDiv.innerHTML = `QR Code: <strong>${result}</strong>`;  // Display the result in the result div
            qrScanner.stop();  // Stop the scanner after detecting a QR code (optional)
        });

        // Start scanning when the video starts playing
        video.onloadedmetadata = () => qrScanner.start();
    } catch (error) {
        console.error('Error accessing the camera', error);
        resultDiv.innerHTML = 'Error: Unable to access the camera.';
    }
}

// Initialize the camera and scanner
startCamera();