import { DeskThingClientConfig } from "../../../config/deskthing.config.types"
import { useClientStore } from "../stores/clientStore"

// Backward compatible exports that use the Zustand store
export const getClientConfig = () => useClientStore.getState().config

// For direct access (backward compatibility)
export let clientConfig: DeskThingClientConfig

// Initialize clientConfig with store value
const updateClientConfigRef = () => {
  clientConfig = useClientStore.getState().config
}

// Subscribe to config changes to keep the ref updated
useClientStore.subscribe(
  (state) => state.config,
  (config) => {
    clientConfig = config
  }
)

// Initialize on first load
updateClientConfigRef()

// Backward compatible class
export class ClientConfig {
  static getConfig(): DeskThingClientConfig {
    return useClientStore.getState().config
  }

  static updateConfig(newConfig: DeskThingClientConfig | Partial<DeskThingClientConfig>) {
    useClientStore.getState().updateConfig(newConfig)
    // Update the legacy clientConfig ref
    clientConfig = useClientStore.getState().config
  }
}