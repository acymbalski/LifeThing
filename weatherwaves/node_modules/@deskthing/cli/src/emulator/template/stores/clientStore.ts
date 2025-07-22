import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { SongData, App, AppManifest, ClientManifest } from '@deskthing/types'
import { sampleSongs, sampleApps, sampleClientManifest } from '../config/sampleData'
import { ClientService } from '../services/clientService'
import { ClientLogger } from '../services/clientLogger'
import { DeskThingClientConfig } from '../../../config/deskthing.config.types'

const defaultClientConfig: DeskThingClientConfig = {
  clientPort: 3000,
  linkPort: 8080,
  logging: {
    level: undefined,
    prefix: '[DeskThing Client]',
    enableRemoteLogging: true
  },
  vitePort: 5173,
  viteLocation: 'http://localhost'
}

interface ClientState {
  // Configuration
  config: DeskThingClientConfig
  
  // Client data
  clientId: string

  // Connection state
  isViteServerConnected: boolean
  connectionAttempts: number

  // App data
  appManifest: AppManifest | null
  clientManifest: ClientManifest
  apps: App[]

  // Music data
  songData: SongData

  // Settings
  settings: Record<string, any>

  // Config actions
  updateConfig: (newConfig: Partial<DeskThingClientConfig>) => void
  resetConfig: () => void

  // Client actions
  setClientId: (id: string) => void

  // Actions
  setViteConnection: (connected: boolean) => void
  incrementConnectionAttempts: () => void
  resetConnectionAttempts: () => void
  setAppManifest: (manifest: AppManifest) => void
  setSongData: (song: Partial<SongData>) => void
  setSettings: (settings: Record<string, any>) => void
  setApps: (apps: App[]) => void

  // Async actions
  requestManifest: () => Promise<void>
  requestSettings: () => Promise<void>
  requestApps: () => Promise<void>
}

export const useClientStore = create<ClientState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    config: defaultClientConfig,
    clientId: '1234567890',
    isViteServerConnected: false,
    connectionAttempts: 0,
    appManifest: null,
    clientManifest: sampleClientManifest,
    apps: sampleApps,
    songData: sampleSongs,
    settings: {},

    // Config actions
    updateConfig: (newConfig) =>
      set((state) => ({
        config: {
          ...state.config,
          ...newConfig,
          logging: {
            ...state.config.logging,
            ...(newConfig.logging || {})
          }
        }
      })),

    resetConfig: () => set({ config: defaultClientConfig }),

    // Client actions
    setClientId: (id) => set({ clientId: id }),

    // Sync actions
    setViteConnection: (connected) => set({ isViteServerConnected: connected }),

    incrementConnectionAttempts: () =>
      set((state) => ({ connectionAttempts: state.connectionAttempts + 1 })),

    resetConnectionAttempts: () => set({ connectionAttempts: 0 }),

    setAppManifest: (manifest) => set({ appManifest: manifest }),

    setSongData: (song) =>
      set((state) => {
        if (state.songData.version == 2 && song.version == 2) {

          return { songData: { ...state.songData, ...song, version: 2 } }
        } else {
          return state
        }
      }),

    setSettings: (settings) => set({ settings }),

    setApps: (apps) => set({ apps }),

    // Async actions
    requestManifest: async () => {
      try {
        const manifest = await new Promise<AppManifest>((resolve) => {
          ClientService.requestManifest(resolve)
        })
        set({ appManifest: manifest })
      } catch (error) {
        ClientLogger.error('Failed to request manifest:', error)
      }
    },

    requestSettings: async () => {
      try {
        const settings = await new Promise<Record<string, any>>((resolve) => {
          ClientService.requestSettings(resolve)
        })
        set({ settings })
      } catch (error) {
        ClientLogger.error('Failed to request settings:', error)
      }
    },

    requestApps: async () => {
      try {
        // For now using sample data, but could be async in future
        set({ apps: sampleApps })
      } catch (error) {
        ClientLogger.error('Failed to request apps:', error)
      }
    }
  }))
)