import { initConfig } from '../config/deskthing.config'
import { DevClient } from './client/client'
import { ServerRunner } from './server/server'
import { TimeService } from './services/timeService'
export async function startDevelopment({ debug }: { debug?: boolean } = { debug: false }) { 
  if (debug) console.log("Debug mode enabled")
  await initConfig({ debug })
  const devServer = new DevClient()
  const serverRunner = new ServerRunner()
  const timeService = new TimeService()
  await Promise.all([
    devServer.start(),
    serverRunner.start(),
    timeService.start()
  ])
}

// Only run if directly executed
if (import.meta.url === `file://${process.argv[1]}`) {
  startDevelopment()
}