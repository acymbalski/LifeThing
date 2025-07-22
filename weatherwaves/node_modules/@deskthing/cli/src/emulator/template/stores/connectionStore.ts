import { create } from 'zustand'
import { ClientService } from '../services/clientService'
import { ClientMessageBus } from '../services/clientMessageBus'
import { ClientLogger } from '../services/clientLogger'
import { clientConfig } from '../config/clientConfig'
import { useClientStore } from './clientStore'
import { useMessageStore } from './messageStore'

interface ConnectionState {
  isInitialized: boolean
  viteDevUrl: string
  
  // Actions
  initialize: () => void
  checkViteServer: () => Promise<void>
  setupMessageBusSubscription: () => () => void
}

export const useConnectionStore = create<ConnectionState>()((set, get) => ({
  isInitialized: false,
  viteDevUrl: `${clientConfig.viteLocation}:${clientConfig.vitePort}`,
  
  initialize: () => {
    if (get().isInitialized) return
    
    ClientService.initialize()
    set({ isInitialized: true })
    ClientLogger.debug('Connection store initialized')
  },
  
  checkViteServer: async () => {
    const { viteDevUrl } = get()
    const { setViteConnection, incrementConnectionAttempts, connectionAttempts } = useClientStore.getState()
    
    try {
      await fetch(viteDevUrl, { method: "HEAD", mode: "no-cors" })
      setViteConnection(true)
    } catch {
      setViteConnection(false)
      incrementConnectionAttempts()
      
      // Retry with exponential backoff
      const delay = Math.min(connectionAttempts * 1000, 5000)
      setTimeout(() => get().checkViteServer(), delay)
    }
  },
  
  setupMessageBusSubscription: () => {
    return ClientMessageBus.subscribe("client:request", (data) => {
      
      const { sendToIframe } = useMessageStore.getState()
      const { setSongData } = useClientStore.getState()
      
      if (data.app === 'client' && data.type === 'song') {
        setSongData(data.payload)
      }
      
      sendToIframe(data)
    })
  }
}))