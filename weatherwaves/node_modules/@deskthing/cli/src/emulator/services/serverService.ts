import { getServerData } from '../server/coms'
import { getManifestDetails } from '../server/manifestDetails'
import { Logger } from './logger'
import { ServerMessageBus } from '../server/serverMessageBus'
import { DeskThingConfig } from '../../config/deskthing.config'

export class ServerService {
  constructor() {
    ServerMessageBus.subscribe("client:request", (data: any) => {
      this.handleClientRequest(data)
    })
  }

  private handleClientRequest(data: any) {
    Logger.debug(`Received request: ${JSON.stringify(data)}`)
    // Handle different types of requests
    switch(data.type) {
      case "getData":
        this.sendServerData()
        break
      case "getManifest":
        this.sendManifestData()
        break
      case "getSettings":
        this.sendSettingsData()
        break
      case "getClientConfig":  // Add this new case
        this.sendClientConfig()
        break
      case "log":  // Add this new case
        Logger.clientLog(data.level, '[CLIENT LOG] ' + data.message)
        break
      default:
        // Handle any other custom requests from client
        if (data.type) {
          ServerMessageBus.publish('client:response', {
            type: data.type,
            payload: data.payload
          })
        }
    }
  }

  public sendToClient(data: any) {
    ServerMessageBus.publish('client:request', {
      type: data.type,
      payload: data.payload,
      request: data.request,
      app: data.app,
      clientId: data.clientId
    })
  }

  private sendServerData() {
    const data = getServerData()
    ServerMessageBus.publish('client:response', {
      type: 'data',
      payload: data.data
    })
  }

  private sendManifestData() {
    const data = getManifestDetails()
    ServerMessageBus.publish('client:response', {
      type: 'manifest',
      payload: data
    })
  }

  private sendSettingsData() {
    const data = getServerData()
    ServerMessageBus.publish('client:response', {
      type: 'settings',
      payload: data.settings
    })
  }

  private async sendClientConfig() {
    const clientConfig = DeskThingConfig.development.client
    ServerMessageBus.publish('client:response', {
      type: 'clientConfig',
      payload: clientConfig // Send the client section of the config
    })
  }
}