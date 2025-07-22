import { createHash } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { loadConfigs } from "./config";
import { sanitizeClient } from "./sanitizeData";
import { ClientLatestJSONLatest, ClientReleaseMeta } from "@deskthing/types";
import { getReleaseFilePath } from "../utils/filePaths";
import { validateRepoUrl } from "../utils/validateRepoUrl";

const getLatestReleasesFromGithubURLs = (
  releaseAssetId: string,
  potentialUrls: string[]
): string => {
  for (const url of potentialUrls) {
    try {
      // Match GitHub repository URLs
      const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (githubMatch) {
        const [, owner, repo] = githubMatch;
        // Clean up repo name (remove .git if present)
        const cleanRepo = repo.replace(".git", "");
        // Construct the latest release asset download URL
        return `https://github.com/${owner}/${cleanRepo}/releases/latest/download/${releaseAssetId}`;
      }
    } catch (error) {
      console.error("\x1b[90m%s\x1b[0m", "Error processing github URL:", error);
    }
  }
  return "";
};

export const generateRelease = async () => {
  console.log("\x1b[33m%s\x1b[0m", "Reading package.json and manifest.json...");
  const { packageJson, manifestJson } = loadConfigs();

  // Calculate hash of the zip file
  console.log("\x1b[33m%s\x1b[0m", "Calculating package hash...");
  const packageName = packageJson.name;
  const version = (manifestJson.version || packageJson.version).replaceAll(
    "v",
    ""
  );
  const distPath = join(process.cwd(), "dist");
  const zipPath = join(distPath, `${packageName}-v${version}.zip`);

  const iconPath = join(distPath, "icons", `${manifestJson.id}.svg`);
  const iconPathAlt = join(distPath, "images", `${manifestJson.id}.svg`);

  const iconFilePath = existsSync(iconPath)
    ? iconPath
    : existsSync(iconPathAlt)
      ? iconPathAlt
      : null;
  const icon = iconFilePath
    ? `data:image/svg+xml;base64,${readFileSync(iconFilePath, "base64")}`
    : "";

  if (icon) {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Icon found, adding to release metadata..."
    );
  }

  // Always prefer the provided updateUrl, but fallback to GitHub URLs generating a new one if it's not provided
  const updateUrl = getLatestReleasesFromGithubURLs(
    `${packageName}-v${version}.zip`,
    [manifestJson.repository, packageJson.repository]
  );

  let fileHash = "";
  let fileSize: number = -1;
  try {
    const fileBuffer = readFileSync(zipPath);
    const hashSum = createHash("sha512");
    hashSum.update(fileBuffer);
    fileHash = hashSum.digest("hex");
    fileSize = fileBuffer.length;
  } catch (err) {
    console.warn(
      "\x1b[33m%s\x1b[0m",
      "Could not generate hash for package file"
    );
  }

  console.log("\x1b[33m%s\x1b[0m", "Generating release metadata...");
  console.log("\x1b[33m%s\x1b[0m", "Validating Url...");
  const isValidUrl = await validateRepoUrl(manifestJson.repository);

  if (isValidUrl) {
    console.log("\x1b[32m%s\x1b[0m", "✅ Url is valid");
  } else {
    console.error("\x1b[31m%s\x1b[0m", "⚠️ Url is not valid! You may need to provide a valid GitHub repository URL in manifest.json. If you ignore, DeskThing will be unable to download your app");
  }

  const release: ClientLatestJSONLatest = {
    meta_version: '0.11.8',
    meta_type: 'client',
    repository: manifestJson.repository || packageJson.repository?.url,
    icon: icon,
    clientManifest: manifestJson,
    updateUrl: updateUrl,
    hash: fileHash,
    hashAlgorithm: "sha512",
    size: fileSize,
    updatedAt: Date.now(),
    createdAt: Date.now(),
    downloads: 0
  };
  return release;
};

export async function createReleaseFile() {
  console.log("\x1b[33m%s\x1b[0m", "Creating release file...");

  try {
    await sanitizeClient();
    const release = await generateRelease();

    const releaseFilePath = await getReleaseFilePath(release.clientManifest.id);

    writeFileSync(releaseFilePath, JSON.stringify(release, null, 2));
    console.log("\x1b[32m%s\x1b[0m", "Release file created successfully");
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", "Failed to create release file:", err);
  }
}
