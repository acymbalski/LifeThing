import { join } from 'path';
import { readFileSync } from 'fs';
import { ClientManifest } from '@deskthing/types';
  export const loadConfigs = () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const manifestJsPath = join(process.cwd(), 'public/manifest.json');
    
    let packageJson;
    let manifestJson: ClientManifest
    
    try {
        packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
        throw new Error(`\x1b[31mFailed to load package.json: ${error.message}\x1b[0m`);
    }
    
    try {
        const manifestContent = readFileSync(manifestJsPath, 'utf8');
        manifestJson = JSON.parse(manifestContent)
    } catch (error) {
        throw new Error(`\x1b[33m❌ Failed to load manifest.json from ${manifestJsPath}. Does it exist?\x1b[0m`)
    }

    return {
      packageJson,
      manifestJson
    };
  };