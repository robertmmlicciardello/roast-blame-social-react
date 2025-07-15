
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up RoastBlame for local development...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📄 Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created successfully!\n');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists\n');
} else {
  console.log('⚠️  .env.example not found, skipping .env creation\n');
}

// Create necessary directories
const dirs = [
  'public/uploads',
  'src/types',
  'src/utils'
];

dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

console.log('\n✨ Development setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Update .env file with your Firebase configuration (optional)');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:5173');
console.log('\n💡 The app will work with mock data if Firebase is not configured.');
