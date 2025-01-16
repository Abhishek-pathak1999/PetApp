import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname and __filename to work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to AndroidManifest.xml
const manifestPath = path.join(__dirname, '../mypetbook-parent/android/app/src/main/AndroidManifest.xml');

async function addPermissions() {
  try {
    let data = await fs.readFile(manifestPath, 'utf8');

    const permissions = `
      <uses-permission android:name="android.permission.RECORD_AUDIO" />
      <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
      <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
      <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    `;

    // Check if permissions are already added
    if (!data.includes('android.permission.RECORD_AUDIO')) {
      data = data.replace('</manifest>', `${permissions}\n</manifest>`);
      await fs.writeFile(manifestPath, data, 'utf8');
      console.log('Permissions added to AndroidManifest.xml');
    } else {
      console.log('Permissions already exist in AndroidManifest.xml');
    }
  } catch (err) {
    console.error('Error reading or writing to AndroidManifest.xml:', err);
  }
}

addPermissions();
