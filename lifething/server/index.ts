import {
  AppSettings,
  DESKTHING_EVENTS,
  SETTING_TYPES,
} from "@deskthing/types";
import { createDeskThing } from "@deskthing/server";
import { ToClientData, GenericTransitData } from "./types"

const DeskThing = createDeskThing<GenericTransitData, ToClientData>()

const start = async () => {
  await setupSettings();
};

const setupSettings = async () => {
  const settings: AppSettings = {
    background_color: {
      label: "Background Color",
      id: 'background_color',
      value: "#000000",
      description: "Set the background color using a hex value (e.g., #000000 for black)",
      type: SETTING_TYPES.STRING,
    },
    foreground_color: {
      label: "Cell Color",
      id: 'foreground_color',
      value: "#1db954",
      description: "Set the color of living cells using a hex value (e.g., #ffffff for white)",
      type: SETTING_TYPES.STRING,
    },
    cell_size: {
      label: "Cell Size (Zoom Level)",
      id: 'cell_size',
      value: 25,
      description: "Size of each cell in pixels. Larger values = bigger cells, fewer total cells",
      type: SETTING_TYPES.NUMBER,
      min: 2,
      max: 50,
    },
    simulation_speed: {
      label: "Simulation Speed",
      id: 'simulation_speed',
      value: 2000,
      description: "Time between generations in milliseconds (lower = faster, higher = slower)",
      type: SETTING_TYPES.NUMBER,
      min: 100,
      max: 4000,
    },
    fade_amount: {
      label: "Fade Transition",
      id: 'fade_amount',
      value: 1,
      description: "Portion of generation time spent fading (0 = instant, 1 = fade for entire generation)",
      type: SETTING_TYPES.NUMBER,
      min: 0,
      max: 1,
    },
    stable_display_time: {
      label: "Stable Display Time",
      id: 'stable_display_time',
      value: 0,
      description: "Time in milliseconds to display each generation after fading (independent of fade time)",
      type: SETTING_TYPES.NUMBER,
      min: 0,
      max: 2000,
    },
    edge_wrapping: {
      label: "Wrap Around Edges",
      id: 'edge_wrapping',
      value: true,
      description: "Whether cells on opposite edges of the screen are considered neighbors",
      type: SETTING_TYPES.BOOLEAN,
    },
    cell_padding: {
      label: "Cell Padding",
      id: 'cell_padding',
      value: 4,
      description: "Spacing between cells in pixels (0 = no gaps, higher = more gaps)",
      type: SETTING_TYPES.NUMBER,
      min: 0,
      max: 50,
    },
    bottom_margin: {
      label: "Bottom Margin",
      id: 'bottom_margin',
      value: 6,
      description: "Pixels to leave empty at bottom of screen (to avoid music progress bar)",
      type: SETTING_TYPES.NUMBER,
      min: 0,
      max: 100,
    },
    cell_corner_radius: {
      label: "Cell Corner Radius",
      id: 'cell_corner_radius',
      value: 8,
      description: "Corner radius for rounded cells in pixels (0 = square cells)",
      type: SETTING_TYPES.NUMBER,
      min: 0,
      max: 20,
    },
    neighbor_opacity_enabled: {
      label: "Show Neighbor Influence",
      id: 'neighbor_opacity_enabled',
      value: true,
      description: "Show empty cells with opacity based on number of living neighbors",
      type: SETTING_TYPES.BOOLEAN,
    },
    neighbor_opacity_increment: {
      label: "Neighbor Opacity Increment",
      id: 'neighbor_opacity_increment',
      value: 0.2,
      description: "Opacity increase per living neighbor (e.g., 0.15 = 15% per neighbor)",
      type: SETTING_TYPES.NUMBER,
      min: 0.01,
      max: 0.5,
    },
  };

  await DeskThing.initSettings(settings);
};

const stop = async () => {
  // Cleanup if needed
};

DeskThing.on(DESKTHING_EVENTS.STOP, stop);
DeskThing.on(DESKTHING_EVENTS.START, start);
