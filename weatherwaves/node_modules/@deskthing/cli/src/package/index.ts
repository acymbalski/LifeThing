import { buildAll } from "./package";
import { createReleaseFile } from "./releaseMeta";

export const packageApp = async ({ guided, noRelease, onlyRelease }: { guided: boolean; noRelease: boolean; onlyRelease: boolean }) => {
    if (guided) {
        console.log("Guided mode is not implemented yet.");
        return;
    }
      if (!onlyRelease) {
          await buildAll()
      } else {
          console.log("\x1b[34m%s\x1b[0m", "⏭️ Skipping build step.");
      }

      if (!noRelease) {
          await createReleaseFile()
      } else {
          console.log("\x1b[34m%s\x1b[0m", "⏭️ Skipping release file creation step.");
    }
}

