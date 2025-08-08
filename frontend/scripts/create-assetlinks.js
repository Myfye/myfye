import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');
const wellKnownPath = path.join(distPath, '.well-known');
const assetlinksPath = path.join(wellKnownPath, 'assetlinks.json');

const assetlinksData = [
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.myfye",
      "sha256_cert_fingerprints": [
        "10:B8:5F:C2:1D:71:F6:F4:38:D5:18:36:F8:39:3B:BD:3A:99:6F:D2:97:FA:57:68:40:C3:57:39:43:26:CF:86"
      ]
    }
  }
];

try {
  // Create .well-known directory if it doesn't exist
  if (!fs.existsSync(wellKnownPath)) {
    fs.mkdirSync(wellKnownPath, { recursive: true });
    console.log('Created .well-known directory');
  }

  // Write the assetlinks.json file
  fs.writeFileSync(assetlinksPath, JSON.stringify(assetlinksData, null, 2));
  console.log('Created assetlinks.json file');

  console.log('✅ Asset links file created successfully at dist/.well-known/assetlinks.json');
} catch (error) {
  console.error('❌ Error creating asset links file:', error);
  process.exit(1);
}
