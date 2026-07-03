const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('.env file exists');
    console.log('Content:', content);
  } else {
    console.log('.env file does not exist');
  }
} catch (error) {
  console.error('Error reading .env file:', error);
}
