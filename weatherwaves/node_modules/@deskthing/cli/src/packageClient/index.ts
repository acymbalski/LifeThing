import { buildAll } from "./package";
import { createReleaseFile } from "./releaseMeta";

export const packageClient = async () => {
    await buildAll()
    await createReleaseFile()
}

