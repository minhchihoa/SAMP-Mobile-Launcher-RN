const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');
const FormData = require('form-data');

// Load .env
const envPath = path.resolve(__dirname, '..', '.env');
// Hardcoded log URL as requested
let uploadUrl = 'http://gtasan.vn/mobile/log_build.php';
let uploadKey = '', appVersion = '0.0.0';

if (fs.existsSync(envPath)) {
    const envData = fs.readFileSync(envPath, 'utf8');
    const keyMatch = envData.match(/^UPLOAD_SECRET=(.*)$/m);
    const versionMatch = envData.match(/^APP_VERSION=(.*)$/m);
    
    if (keyMatch) uploadKey = keyMatch[1].trim();
    if (versionMatch) appVersion = versionMatch[1].trim();
}

if (!uploadUrl || !uploadKey) {
    console.error('❌ Missing UPLOAD_API/LOG_BUILD_API or UPLOAD_SECRET in .env');
    process.exit(1);
}

// Get description from args or trae_changes.txt
let description = process.argv[2];

const traeChangesPath = path.resolve(__dirname, '..', 'trae_changes.txt');
if (!description || description.trim() === '') {
    if (fs.existsSync(traeChangesPath)) {
        try {
            description = fs.readFileSync(traeChangesPath, 'utf8').trim();
            console.log('📄 Loaded build description from trae_changes.txt');
        } catch (e) {
            console.warn('⚠️ Could not read trae_changes.txt:', e.message);
        }
    }
}

if (!description) {
    description = 'Auto-build by Trae (No description provided)';
}

// Get git info (if available)
let changedFiles = '';
try {
    // Try to get the last commit message if description is generic
    if (description === 'Auto-build by Trae') {
        const lastCommitMsg = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
        if (lastCommitMsg) {
            // Use last commit message
             // But we prefer the arg passed from batch file
        }
    }
    
    // Get list of changed files (staged + unstaged + last commit)
    // Use git diff-tree to get files changed in HEAD
    // Format: relative/path/to/file
    changedFiles = execSync('git diff-tree --no-commit-id --name-only -r HEAD', { encoding: 'utf8' }).trim();
    
    // If no files in HEAD (maybe not committed yet?), try status
    if (!changedFiles) {
        changedFiles = execSync('git diff --name-only', { encoding: 'utf8' }).trim();
    }
    
    // Ensure relative paths (remove any absolute paths if present, though git usually returns relative)
    // Also remove empty lines
    changedFiles = changedFiles.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/\\/g, '/')) // Normalize slashes
        .join('\n');
        
} catch (e) {
    changedFiles = 'Git info not available';
}

console.log('🚀 Logging build to MySQL...');
console.log(`Version: ${appVersion}`);
console.log(`Description: ${description}`);
console.log(`Target URL: ${uploadUrl}`);

async function logBuild() {
    try {
        const form = new FormData();
        form.append('key', uploadKey);
        form.append('version', appVersion);
        form.append('description', description);
        form.append('changed_files', changedFiles);
        form.append('author', 'Trae');

        const response = await axios.post(uploadUrl, form, {
            headers: form.getHeaders()
        });

        if (response.data.status === 'success') {
            console.log('✅ Build log saved to MySQL successfully!');
        } else {
            console.error('❌ Failed to save build log:', response.data.message);
        }
    } catch (error) {
        console.error('❌ Error connecting to log API:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

logBuild();
