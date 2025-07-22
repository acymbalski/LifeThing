  import path from 'path';
  import fs from 'fs';
import { Logger } from '../services/logger'

  type PlatformTypes = 'linux' | 'windows' | 'macos';
  type TagTypes = 'system' | 'utility' | 'media' | 'development' | 'network' | 'gaming';
  export type AppManifest = {
    id: string;
    isWebApp: boolean;
    requires: string[];
    label: string;
    version: string;
    description: string;
    author: string;
    platforms: PlatformTypes[];
    homepage: string;
    version_code: number;
    compatible_server: string;
    compatible_client: string;
    repository: string;
    tags: TagTypes[];
    requiredVersions: Record<string, string>;
  };

  export const getManifestDetails = (): AppManifest => {
    const manifestPath = path.join(process.cwd(), 'deskthing', 'manifest.json');
    const altManifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    let finalPath = manifestPath
    if (!fs.existsSync(finalPath)) {
      finalPath = altManifestPath
      Logger.error("❌ Failed to load manifest.json from deskthing/manifest.json, trying public/manifest.json");
      if (!fs.existsSync(finalPath)) {
        throw new Error("\x1b[31m❌ Failed to load manifest.json from both locations\x1b[0m");
      } else {
        Logger.info("\x1b[32m✅ Successfully loaded manifest.json from public/manifest.json\x1b[0m");
      }
    }
    const manifest = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
    
    return {
      id: manifest.id,
      isWebApp: manifest.isWebApp,
      requires: manifest.requires,
      label: manifest.label,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      platforms: manifest.platforms as PlatformTypes[],
      homepage: manifest.homepage,
      version_code: manifest.version_code,
      compatible_server: manifest.compatible_server,
      compatible_client: manifest.compatible_client,
      repository: manifest.repository,
      tags: manifest.tags as TagTypes[],
      requiredVersions: manifest.requiredVersions
    };
  };