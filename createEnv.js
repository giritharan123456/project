const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = 'VITE_API_URL=http://localhost:5000/api';

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('.env file created successfully');
console.log('Content:', envContent);
