import { pathToFileURL } from "node:url";
import { workerData, parentPort } from "node:worker_threads"

// shims that are imported during the build process on deskthing - if these throw an error, fix your code instead of changing this
import { createRequire as DeskThingCreateRequire } from 'module';
import { fileURLToPath as DeskThingFileURLToPath } from 'url';
import { dirname as DeskThingDirname } from 'node:path';

const require = DeskThingCreateRequire(import.meta.url);
const __filename = DeskThingFileURLToPath(import.meta.url);
const __dirname = DeskThingDirname(__filename);

// Set environment variables from workerData
Object.entries(workerData).forEach(([key, value]) => {
  process.env[key] = value as string
});

function setupConsoleCapture() {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;

  console.log = (...args) => {
    parentPort?.postMessage({ log: args.map(arg => String(arg)).join(' ') });
    originalConsoleLog(...args);
  };

  console.error = (...args) => {
    parentPort?.postMessage({ error: args.map(arg => String(arg)).join(' ') });
    originalConsoleError(...args);
  };

  console.warn = (...args) => {
    parentPort?.postMessage({ log: args.map(arg => String(arg)).join(' ') });
    originalConsoleWarn(...args);
  };

  console.info = (...args) => {
    parentPort?.postMessage({ log: args.map(arg => String(arg)).join(' ') });
    originalConsoleInfo(...args);
  };
}

const setupServer = async () => {
  setupConsoleCapture()
  process.env.DESKTHING_ENV = "development";

  const serverPath = process.env.SERVER_INDEX_PATH;
  if (!serverPath) {
    throw new Error("SERVER_INDEX_PATH is not defined!");
  }

  const serverUrl = pathToFileURL(serverPath).href;

  parentPort?.postMessage({
    type: "server:log",
    payload: `Starting up... ${serverUrl}`,
  });

  // keep alive

  const importDeskThing = async () => {
    try {

      await import(serverUrl);
      process.send?.({
        type: "server:log",
        payload: "DeskThing module loaded successfully.",
      });
    } catch (error) {
      const err = error as Error;
      console.error("\x1b[31m%s\x1b[0m", "Critical error in serverProcess: ", err);
      parentPort?.postMessage?.({
        type: "server:log",
        payload: `Failed to load DeskThing: ${err?.message}`,
      });
      throw error
    }
  };

  try {
    await importDeskThing();
  } catch (error) {
    const err = error as Error;
    console.error("\x1b[31m%s\x1b[0m", "Critical error in serverProcess: ", err);
    process.exit(1);
  }
};

setupServer();
