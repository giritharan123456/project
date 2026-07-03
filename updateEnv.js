const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = 'VITE_API_URL=http://localhost:5000/api';

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('.env file updated successfully');
  console.log('Content:', envContent);
} catch (error) {
  console.error('Error updating .env file:', error);
}
