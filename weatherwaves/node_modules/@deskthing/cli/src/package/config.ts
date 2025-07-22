import { join } from 'path';
import { readFileSync } from 'fs';
import { AppManifest } from '@deskthing/types';
export const loadConfigs = () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const manifestJsonPath = join(process.cwd(), 'deskthing/manifest.json');

    let packageJson;
    let manifestJson: AppManifest

    try {
        packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
        throw new Error(`\x1b[31mFailed to load package.json: ${error.message}\x1b[0m`);
    }

    try {
        manifestJson = JSON.parse(readFileSync(manifestJsonPath, 'utf8'));
    } catch (error) {
        try {
            console.log("\x1b[33m❌ Failed to load manifest.json from deskthing/manifest.json, trying public/manifest.json\x1b[0m");
            const oldmanifestJsonPath = join(process.cwd(), 'public/manifest.json');
            manifestJson = JSON.parse(readFileSync(oldmanifestJsonPath, 'utf8'));
            console.log("\x1b[32m✅ Successfully loaded manifest.json from public/manifest.json\x1b[0m");
        } catch (err2) {
            throw new Error(`\x1b[31mFailed to load manifest.json from both locations: ${error.message}, ${err2.message}\x1b[0m`);
        }
    }
    return {
        packageJson,
        manifestJson
    };
};