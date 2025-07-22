import {
  App,
  ClientConnectionMethod,
  ClientManifest,
  ClientPlatformIDs,
  PlatformTypes,
  SongData,
  TagTypes,
} from "@deskthing/types";
import { useClientStore } from "../stores/clientStore"

export const sampleSongs: SongData = {
  album: "Random Access Memories",
  artist: "Daft Punk",
  playlist: "Electronic Essentials",
  playlist_id: "playlist_001",
  track_name: "Get Lucky",
  shuffle_state: false,
  repeat_state: "off",
  is_playing: true,
  can_fast_forward: true,
  can_skip: true,
  can_like: true,
  can_change_volume: true,
  can_set_output: true,
  track_duration: 369000,
  track_progress: 145000,
  volume: 75,
  thumbnail: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647",
  device: "Desktop Speaker",
  id: "track_001",
  device_id: "device_001",
  liked: true,
  color: {
    value: [41, 128, 185],
    rgb: "rgb(41, 128, 185)",
    rgba: "rgba(41, 128, 185, 1)",
    hex: "#2980b9",
    hexa: "#2980b9ff",
    isDark: true,
    isLight: false,
  },
  version: 1
};

export const sampleApps: App[] = [
  {
    name: "sample-app-1",
    manifest: {
      id: "sample-app-1",
      requires: [],
      version: "1.0.0",
      description: "Sample App 1",
      author: "Sample Author",
      platforms: [PlatformTypes.WINDOWS, PlatformTypes.ANDROID],
      tags: [TagTypes.UTILITY_ONLY],
      requiredVersions: {
        server: "1.0.0",
        client: "1.0.0",
      },
    },
    enabled: false,
    running: false,
    timeStarted: 0,
    prefIndex: 0,
  },
  {
    name: "sample-app-2",
    manifest: {
      id: "sample-app-2",
      requires: [],
      version: "1.0.0",
      description: "Sample App 2",
      author: "Sample Author",
      platforms: [PlatformTypes.WINDOWS, PlatformTypes.ANDROID],
      tags: [TagTypes.AUDIO_SOURCE],
      requiredVersions: {
        server: "1.0.0",
        client: "1.0.0",
      },
    },
    enabled: false,
    running: false,
    timeStarted: 0,
    prefIndex: 0,
  },
];

// Dynamic client manifest that uses store config
export const getSampleClientManifest = (): ClientManifest => {
  
  return {
    id: "sample-client",
    name: "Sample Client",
    short_name: "SampleClient",
    description: "A sample client manifest",
    reactive: true,
    repository: "https://github.com/sample/client",
    author: "Sample Author",
    version: "1.0.0",
    compatibility: {
      server: "1.0.0",
      app: "1.0.0",
    },
    context: {
      ip: "127.0.0.1",
      port: 3000,
      method: ClientConnectionMethod.LAN,
      id: ClientPlatformIDs.Desktop,
      name: "Desktop",
    },
  }
}

// For backward compatibility
export const sampleClientManifest = getSampleClientManifest()
