const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  const versionMatch = envContent.match(/APP_VERSION=(.*)/);

  if (versionMatch) {
    const currentVersion = versionMatch[1].trim();
    const versionParts = currentVersion.split('.');
    
    if (versionParts.length === 3) {
      const patch = parseInt(versionParts[2], 10);
      const newPatch = patch + 1;
      const newVersion = `${versionParts[0]}.${versionParts[1]}.${newPatch}`;
      
      const newEnvContent = envContent.replace(`APP_VERSION=${currentVersion}`, `APP_VERSION=${newVersion}`);
      fs.writeFileSync(envPath, newEnvContent, 'utf8');
      
      console.log(`Updated APP_VERSION from ${currentVersion} to ${newVersion}`);
    } else {
      console.error('Invalid version format. Expected x.y.z');
      process.exit(1);
    }
  } else {
    console.error('APP_VERSION not found in .env');
    process.exit(1);
  }
} catch (error) {
  console.error('Error updating version:', error);
  process.exit(1);
}
