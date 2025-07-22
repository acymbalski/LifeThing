import { join, resolve } from "path";
import zl from "zip-lib";
import { readdir, stat, cp, rm, mkdir } from "fs/promises";
import { loadConfigs } from "./config";
import { build as buildEsbuild } from "esbuild";
import { build as buildVite } from "vite";
import viteLegacyPlugin from "@vitejs/plugin-legacy"
import { exec } from "child_process"

async function buildServer() {
  await buildEsbuild({
    entryPoints: ["server/index.ts"],
    bundle: true,
    platform: "node",
    outfile: "dist/server/index.js",
    target: "ESNext",
    format: "esm",
    external: ['node:*', 'fs', 'path', 'child_process'],
    resolveExtensions: [".ts", ".js"],
    sourcemap: true,
    banner: {
      js: `
// ESM shims for Node.js built-in modules
import { createRequire as DeskThingCreateRequire } from 'module';
import { fileURLToPath as DeskThingFileURLToPath } from 'url';
import { dirname as DeskThingDirname } from 'node:path';

const require = DeskThingCreateRequire(import.meta.url);
const __filename = DeskThingFileURLToPath(import.meta.url);
const __dirname = DeskThingDirname(__filename);
`}
  });
}

async function buildWorkers() {
  try {
    await stat("server/workers")
  } catch (e) {
    console.warn("\x1b[35mUnable to find workers file\x1b[0m");
    console.warn("\x1b[90m(Can be ignored if you do not have workers)\x1b[0m");
    return
  }
  try {
    const workersDir = "server/workers";
    const files = await readdir(workersDir);
    const tsFiles = files
      .filter(file => file.endsWith('.ts'))
      .map(file => join(workersDir, file));

    // Only proceed if there are TypeScript files to build
    if (tsFiles.length === 0) {
      console.warn("\x1b[35mNo TypeScript files found in workers directory\x1b[0m");
      return;
    }


    await buildEsbuild({
      entryPoints: tsFiles,
      bundle: true,
      platform: "node",
      outdir: "dist/server/workers",
      target: "ESNext",
      format: "esm",
      resolveExtensions: [".ts", ".js"],
      sourcemap: true,
      banner: {
        js: `
          // ESM shims for Node.js built-in modules
          import { createRequire as DeskThingCreateRequire } from 'module';
          import { fileURLToPath as DeskThingFileURLToPath } from 'url';
          import { dirname as DeskThingDirname } from 'node:path';

            const require = DeskThingCreateRequire(import.meta.url);
            const __filename = DeskThingFileURLToPath(import.meta.url);
            const __dirname = DeskThingDirname(__filename);
        `      }
    });
  } catch (error) {
    console.error("\x1b[31mError building workers:\x1b[0m", error);
  }
}

const buildPostinstall = async () => {
  try {
    await stat("postinstall")
  } catch (e) {
    console.warn("\x1b[35mUnable to find postinstall file\x1b[0m");
    console.warn("\x1b[90m(Can be ignored if you do not have a postinstall script)\x1b[0m");
    return
  }

  try {
    await buildEsbuild({
      entryPoints: ["postinstall/index.ts"],
      bundle: true,
      platform: "node",
      target: "ESNext",
      format: "esm",
      resolveExtensions: [".ts", ".js"],
      sourcemap: false,
      outfile: "dist/postinstall.mjs", // ensure that it is a module
      minify: true,
    });
  } catch (error) {
    console.error("\x1b[31mError building postinstall:\x1b[0m", error);
  }
}

async function buildClient() {
  await buildVite({
    configFile: "vite.config.ts",
    base: "./",
    plugins: [viteLegacyPlugin({
      targets: ["Chrome 69"]
    })],
    build: {
      outDir: "dist/client",
      rollupOptions: {
        output: {
          assetFileNames: "[name]-[hash][extname]",
          chunkFileNames: "[name]-[hash].js",
          entryFileNames: "[name]-[hash].js",
        },
      },
    },
  });
}

async function copyDeskThing() {
  const deskthingPath = resolve("deskthing");
  const publicPath = resolve("public");
  const distFile = resolve("dist");
  const manifestFile = join(deskthingPath, "manifest.json");
  const oldmanifestFile = join(publicPath, "manifest.json");

  if (await stat(manifestFile).catch(() => false)) {
    await cp(deskthingPath, join(distFile), { recursive: true });
  } else if (await stat(oldmanifestFile).catch(() => false)) {
    console.log(
      "Using old manifest.json. Please move this to /deskthing or run `deskthing update`"
    );
    await cp(publicPath, join(distFile), { recursive: true });
  } else {
    throw new Error("No manifest.json found in either /deskthing or /public");
  }
}

async function addFilesToArchive(
  archive: zl.Zip,
  folderPath: string,
  baseFolder = ""
) {
  const exists = await stat(folderPath).catch(() => false);
  if (!exists) return;

  const files = await readdir(folderPath);

  for (const file of files) {
    const filePath = join(folderPath, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      await addFilesToArchive(archive, filePath, join(baseFolder, file));
    } else {
      await archive.addFile(filePath, join(baseFolder, file));
    }
  }
}
export async function createPackage() {
  const { packageJson, manifestJson } = loadConfigs();

  const packageName = packageJson.name;
  const version = manifestJson.version || packageJson.version;
  const distPath = resolve("dist");

  const outputFile = join(distPath, `${packageName}-v${version}.zip`);

  console.log("\x1b[36m%s\x1b[0m", "Zipping to " + outputFile);
  const archive = new zl.Zip();

  console.log("\x1b[33m%s\x1b[0m", "📦 Adding files to archive...");
  await addFilesToArchive(archive, distPath);

  console.log("\x1b[33m%s\x1b[0m", "📝 Writing archive to file...");
  await archive.archive(outputFile);
  console.log("\x1b[32m%s\x1b[0m", "✅ Archive written successfully!");
}

async function clean() {
  const distPath = resolve("dist");
  try {
    await mkdir(distPath, { recursive: true });
    const files = await readdir(distPath);
    for (const file of files) {
      const filePath = join(distPath, file);
      await rm(filePath, { recursive: true, force: true });
    }
  } catch (error) {
    await mkdir(distPath, { recursive: true });
  }
}

async function ensureNpmBuilt() {
  const nodeModulesPath = resolve("node_modules");
  const nodeModulesExists = await stat(nodeModulesPath).catch(() => false);
  if (!nodeModulesExists) {
    console.log("\x1b[33m%s\x1b[0m", "📦 Running npm install...");
    await new Promise((resolve, reject) => {
      exec('npm install', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  } else {
    console.log("\x1b[32m%s\x1b[0m", "✅ NPM is already built!");
  }
}

export async function buildAll() {
  // Clear all of the files in the dist folder that relate to the build
  console.log("\x1b[33m%s\x1b[0m", "🧹 Clearing dist folder...");
  await clean();

  console.log("\x1b[33m%s\x1b[0m", "📦 Ensuring NPM has been built...");
  await ensureNpmBuilt();

  console.log("\x1b[33m%s\x1b[0m", "🏗️ Building Client...");
  await buildClient();

  console.log("\x1b[33m%s\x1b[0m", "🏗️ Building Server...");
  await buildServer();

  console.log("\x1b[33m%s\x1b[0m", "🏗️ Building Workers...");
  await buildWorkers();

  console.log("\x1b[33m%s\x1b[0m", "🏗️ Building Postinstall Script...");
  await buildPostinstall();

  console.log("\x1b[33m%s\x1b[0m", "🏗️ Copying Manifest...");
  await copyDeskThing();

  console.log("\x1b[33m%s\x1b[0m", "📦 Creating package...");
  await createPackage();

  console.log("\x1b[32m%s\x1b[0m", "✅ Build completed successfully!");
}
