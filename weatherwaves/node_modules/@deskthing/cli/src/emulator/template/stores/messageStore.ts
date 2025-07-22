import { create } from 'zustand'
import { ClientToDeviceData, DeviceToClientCore, DEVICE_CLIENT, AppManifest } from '@deskthing/types'
import { ClientService } from '../services/clientService'
import { ClientLogger } from '../services/clientLogger'
import { useClientStore } from './clientStore'

interface MessageState {
  // Message queue for debugging
  messageHistory: Array<{ timestamp: number; type: string; data: any }>

  // Actions
  handleIframeMessage: (data: ClientToDeviceData, origin: string) => void
  sendToIframe: (data: DeviceToClientCore) => void
  addToHistory: (type: string, data: any) => void
  clearHistory: () => void
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  messageHistory: [],

  addToHistory: (type, data) =>
    set((state) => ({
      messageHistory: [
        ...state.messageHistory.slice(-99), // Keep last 100 messages
        { timestamp: Date.now(), type, data }
      ]
    })),

  clearHistory: () => set({ messageHistory: [] }),

  sendToIframe: (data) => {
    const iframe = document.querySelector('#app') as HTMLIFrameElement
    if (iframe?.contentWindow) {
      const augmentedData = { ...data, source: "deskthing" }
      iframe.contentWindow.postMessage(augmentedData, "*")
      get().addToHistory('SENT_TO_IFRAME', augmentedData)
    }
  },

  handleIframeMessage: (data, origin) => {
    const { addToHistory } = get()
    const { appManifest, setSongData } = useClientStore.getState()

    addToHistory('RECEIVED_FROM_IFRAME', data)

    if (data.app === "client") {
      handleClientMessage(data)
    } else {
      handleAppMessage(data, appManifest)
    }
  }
}))

// Helper functions
const handleClientMessage = (data: ClientToDeviceData) => {
  const { sendToIframe } = useMessageStore.getState()
  const { songData, settings, apps, clientManifest } = useClientStore.getState()

  switch (data.type) {
    case "get":
      switch (data.request) {
        case "song":
          ClientLogger.debug("Get request for music, Sending music", songData)
          sendToIframe({ type: DEVICE_CLIENT.MUSIC, app: "client", payload: songData })
          break

        case "settings":
          ClientLogger.debug("Get request for settings, Sending settings")
          sendToIframe({ type: DEVICE_CLIENT.SETTINGS, app: "client", payload: settings })
          break

        case "apps":
          ClientLogger.debug("Get request for apps, Sending apps", apps)
          sendToIframe({ type: DEVICE_CLIENT.APPS, app: "client", payload: apps })
          break

        case "manifest":
          ClientLogger.debug("Get request for manifest, Sending manifest")
          sendToIframe({ type: DEVICE_CLIENT.MANIFEST, app: "client", payload: clientManifest })
          break
      }
      break

    case "log":
      ClientLogger.clientLog(data.request as any, data.payload.message, ...(data.payload.data || []))
      break

    case "key":
    case "action":
      handleActionMessage(data)
      break
  }
}

const handleAppMessage = (data: ClientToDeviceData, appManifest: AppManifest | null) => {
  ClientLogger.debug('Sending data to server', data)
  const clientId = useClientStore.getState().clientId

  const appId = data.app || appManifest?.id || "unknownId"
  ClientService.sendToApp({
    ...data,
    app: appId,
    clientId: clientId
  })
}

const handleActionMessage = (data: Extract<ClientToDeviceData, { type: 'action' | 'key' }>) => {
  const { appManifest, clientId } = useClientStore.getState()

  ClientLogger.debug('Handling action', data)

  const appId = data.app || appManifest?.id || "unknownId"
  ClientService.sendToApp({
    ...data,
    app: appId,
    clientId: clientId
  })
}