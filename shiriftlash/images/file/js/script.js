document.getElementById('convertToBinaryButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (fileInput) {
        const reader = new FileReader();
        if (fileInput.type.startsWith('image/')) {
            reader.onload = function(event) {
                const binary = Array.from(new Uint8Array(event.target.result)).map(byte => byte.toString(2).padStart(8, '0')).join(' ');
                downloadFile(binary, '2-lik_rasm.txt');
            };
            reader.readAsArrayBuffer(fileInput);
        } else {
            reader.onload = function(event) {
                const text = event.target.result;
                const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                downloadFile(binary, '2-lik kod.txt');
            };
            reader.readAsText(fileInput);
        }
    }
});

document.getElementById('convertToOctalButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (fileInput) {
        const reader = new FileReader();
        if (fileInput.type.startsWith('image/')) {
            reader.onload = function(event) {
                const octal = Array.from(new Uint8Array(event.target.result)).map(byte => byte.toString(8).padStart(3, '0')).join(' ');
                downloadFile(octal, '8-lik_rasm.txt');
            };
            reader.readAsArrayBuffer(fileInput);
        } else {
            reader.onload = function(event) {
                const text = event.target.result;
                const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
                downloadFile(octal, '8-lik Kod.txt');
            };
            reader.readAsText(fileInput);
        }
    }
});

document.getElementById('convertToHexButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (fileInput) {
        const reader = new FileReader();
        if (fileInput.type.startsWith('image/')) {
            reader.onload = function(event) {
                const hex = Array.from(new Uint8Array(event.target.result)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
                downloadFile(hex, '16-lik_rasm.txt');
            };
            reader.readAsArrayBuffer(fileInput);
        } else {
            reader.onload = function(event) {
                const text = event.target.result;
                const hex = text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
                downloadFile(hex, '16-lik Kod.txt');
            };
            reader.readAsText(fileInput);
        }
    }
});

document.getElementById('convertToTextButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            let text;

            if (content.match(/^[01\s]+$/)) {
                text = content.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
            } else if (content.match(/^[0-7\s]+$/)) {
                text = content.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
            } else if (content.match(/^[0-9a-fA-F\s]+$/)) {
                text = content.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
            } else {
                alert('Fayl formati noto\'g\'ri');
                return;
            }

            downloadFile(text, 'decodlangan_matn.txt');
        };
        reader.readAsText(fileInput);
    }
});

document.getElementById('decodeToImageButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            let byteArray;

            if (content.match(/^[01\s]+$/)) {
                const binary = content.split(' ');
                byteArray = new Uint8Array(binary.map(bin => parseInt(bin, 2)));
            } else if (content.match(/^[0-7\s]+$/)) {
                const octal = content.split(' ');
                byteArray = new Uint8Array(octal.map(oct => parseInt(oct, 8)));
            } else if (content.match(/^[0-9a-fA-F\s]+$/)) {
                const hex = content.split(' ');
                byteArray = new Uint8Array(hex.map(hex => parseInt(hex, 16)));
            } else {
                alert('Fayl formati noto\'g\'ri');
                return;
            }

            const blob = new Blob([byteArray], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            const link = document.getElementById('downloadLink');
            link.href = url;
            link.download = 'decodlangan_rasm.png';
            link.style.display = 'block';
        };
        reader.readAsText(fileInput);
    }
});

function downloadFile(content, fileName) {
    const link = document.getElementById('downloadLink');
    const blob = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = 'block';
}




let users = JSON.parse(localStorage.getItem('users')) || {};

let lastReset = localStorage.getItem('lastReset');
const currentMonth = new Date().getMonth();

if (!lastReset || new Date(lastReset).getMonth() !== currentMonth) {
    users = {};
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('lastReset', new Date().toISOString());
}

function getUserIP(callback) {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => callback(data.ip));
}

function updateUserTable() {
    const userTableBody = document.getElementById('userTable').querySelector('tbody');
    userTableBody.innerHTML = '';

    let totalVisits = 0;
    for (const [ip, visits] of Object.entries(users)) {
        const row = document.createElement('tr');
        const ipCell = document.createElement('td');
        const visitsCell = document.createElement('td');

        ipCell.textContent = ip;
        visitsCell.textContent = visits;

        row.appendChild(ipCell);
        row.appendChild(visitsCell);
        userTableBody.appendChild(row);

        totalVisits += visits;
    }

    document.getElementById('totalVisits').textContent = totalVisits;
}

getUserIP(ip => {
    if (users[ip]) {
        users[ip]++;
    } else {
        users[ip] = 1;
    }
    localStorage.setItem('users', JSON.stringify(users));
    updateUserTable();
});

document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'ahliddin' && password === '20092012ash') {
        document.querySelector('.admin-login').style.display = 'none';
        document.querySelector('.admin-panel').style.display = 'block';
    } else {
        alert('Login yoki parol noto\'g\'ri');
    }
});