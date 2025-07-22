import { existsSync } from "node:fs";
import { join } from "node:path";

export const getReleaseFilePath = async (fileId: string): Promise<string> => {
    const distPath = join(process.cwd(), 'dist');
    const defaultPath = join(distPath, 'latest.json');
    const appSpecificPath = join(distPath, `${fileId}.json`);
    return existsSync(defaultPath) ? appSpecificPath : defaultPath;
}
