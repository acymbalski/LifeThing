#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { packageApp } from "./package";
import { packageClient } from "./packageClient";
import { stat, writeFile } from "fs/promises";
import { initConfig } from "./config/deskthing.config";

await initConfig({ silent: true });

const __dirname = dirname(fileURLToPath(import.meta.url));
const thisPackage = (await import("../package.json", {
  assert: { type: "json" },
})
  .catch(() => ({ default: { version: "0.0.0" } }))
  .then((module) => module?.default)) || { version: "0.0.0" };
// Banner for the CLI
console.log(`
  ------------------------------------------------
      _           _    _   _     \x1b[92m_\x1b[0m             
     | |         | |  | | | |   \x1b[92m(_)\x1b[0m            
   __| | ___  ___| | _| |_| |__  _ _ __   __ _ 
  / _\` |/ _ \\/ __| |/ / __| '_ \\| | '_ \\ / _\` |
 | (_| |  __/\\__ \\   <| |_| | | | | | | | (_| |
  \\__,_|\\___||___/_|\\_\\\\__|_| |_|_|_| |_|\\__, |
                                          __/ |
                                         |___/  
                Version ${thisPackage?.version || "0.11.0"}`);
yargs(hideBin(process.argv))
  .scriptName("deskthing")
  .command(
    "dev",
    "Start development server",
    (yargs) => {
      return yargs.option("debug", {
        type: "boolean",
        default: false,
        description: "Enable debug mode",
      });
    },
    async (argv) => {
      console.log(
        `------- \x1b[1mdev\x1b[0m -- init -- update -- package --------`
      );
      console.log("\n\n\x1b[1m🚀 Starting development server...\x1b[0m\n\n");
      // Install tsm if not already installed
      const tsmPath = join(process.cwd(), "node_modules", "tsm");
      try {
        await stat(tsmPath);
        console.log("\x1b[1mtsm is installed\x1b[0m\n");
      } catch (e) {
        console.log("\n\x1b[1mInstalling tsm dependency...\x1b[0m\n");
        execSync("npm install tsm --no-save --legacy-peer-deps", {
          stdio: "inherit",
        });
      }

      const indexPath = join(__dirname, "./emulator/index.js");
      const fileUrl = `file://${indexPath.replace(/\\/g, "/")}`;
      const { startDevelopment } = await import(fileUrl);
      await startDevelopment({ debug: argv.debug });
    }
  )
  .command(
    "update",
    "Update dependencies and configurations",
    (yargs) => {
      return yargs
        .option("force", {
          type: "boolean",
          default: false,
          description: "Force update all dependencies",
        })
        .option("no-overwrite", {
          type: "boolean",
          default: false,
          description: "Do not overwrite existing files",
        })
        .option("debug", {
          type: "boolean",
          default: false,
          description: "Add verbose debugging",
        })
        .option("silent", {
          type: "boolean",
          default: false,
          description: "Make it so there is no output to the console",
        });
    },
    async (argv) => {
      if (!argv.silent)
        console.log(
          `------- dev -- init -- \x1b[1mupdate\x1b[0m -- package --------`
        );
      if (!argv.silent)
        console.log("Updating dependencies and configurations...");

      const args = ["create-deskthing@latest", "--update"];

      if (argv["no-overwrite"]) {
        if (!argv.silent) console.log("\x1b[32m✓ No Overwrite Enabled\x1b[0m");
        args.push("--no-overwrite");
      }
      if (argv.force) {
        if (!argv.silent) console.log("\x1b[32m✓ Force Enabled\x1b[0m");
        args.push("--force");
      }
      if (argv.debug) {
        if (!argv.silent) console.log("\x1b[32m✓ Debug Enabled\x1b[0m");
        args.push("--debug");
      }
      if (argv.silent) {
        console.log("\x1b[32m✓ Silent Enabled\x1b[0m");
        args.push("--silent");
      }

      execSync(`npx ${args.join(" ")}`, { stdio: "inherit" });
    }
  )
  .command(
    "package",
    "Package and zip up your app. Also generates needed manifest files",
    (yargs) => {
      return yargs
        .option("guided", {
          type: "boolean",
          default: false,
          description: "Force update all dependencies",
        })
        .option("no-release", {
          type: "boolean",
          default: false,
          description: "Skip generating release metadata files",
        })
        .option("only-release", {
          type: "boolean",
          default: false,
          description: "Only generate release metadata files",
        });
    },
    async (argv) => {
      console.log(
        `------- dev -- init -- update -- \x1b[1mpackage\x1b[0m --------`
      );
      console.log("Packaging app...");

      await packageApp({
        guided: argv.guided,
        noRelease: argv.noRelease,
        onlyRelease: argv.onlyRelease,
      });
    }
  )
  .command(
    "package-client",
    "Package and zip up your client. Also generates needed manifest files",
    (yargs) => {
      return yargs;
    },
    async () => {
      console.log(`------- dev -- init -- update -- package --------\n`);
      console.log(
        `-------           \x1b[1mpackaging client\x1b[0m       --------\n`
      );

      await packageClient();
    }
  )
  .command(
    "init",
    "Setup the DeskThing template",
    (yargs) => {
      return yargs;
    },
    async () => {
      console.log(
        `------- dev -- \x1b[1minit\x1b[0m -- update -- package --------`
      );
      console.log("Setting up the DeskThing template...");
      execSync("npm create deskthing@latest --create", { stdio: "inherit" });
    }
  )
  .command("$0", "Show available commands", () => {
    console.log(`------- dev -- init -- update -- package --------`);
    console.log("Available commands:");
    console.log("  dev       Start development server");
    console.log("  update    Update dependencies and configurations");
    console.log("  package   Package and zip up your app");
    console.log("  init  Setup the DeskThing template");
    console.log(
      "\nRun `deskthing <command> --help` for more information about a command."
    );
  })
  .command(
    "init-config",
    "Create a typed configuration file",
    (yargs) => {
      return yargs;
    },
    async () => {
      console.log(
        `\n\n------- \x1b[1mCreating typed configuration file\x1b[0m --------\n\n`
      );

      const configTemplate = `

// @ts-check
// version ${thisPackage?.version || "0.11.0"}
import { defineConfig } from '@deskthing/cli';

export default defineConfig({
  development: {
    logging: {
      level: "info",
      prefix: "[DeskThing Server]",
    },
    client: {
      logging: {
        level: "info",
        prefix: "[DeskThing Client]",
        enableRemoteLogging: true,
      },
      clientPort: 3000,
      viteLocation: "http://localhost",
      vitePort: 5173,
      linkPort: 8080,
    },
    server: {
      editCooldownMs: 1000,
    },
  }
});
  `;

      const configPath = join(process.cwd(), "deskthing.config.js");
      try {
        await writeFile(configPath, configTemplate);
        console.log(`\n\n\x1b[32m✅ File created at\n${configPath}\x1b[0m\n\n`);
      } catch (error) {
        console.error(
          "\x1b[31m❌ Failed to create configuration file:\x1b[0m",
          error
        );
      }
    }
  )
  .parse();
