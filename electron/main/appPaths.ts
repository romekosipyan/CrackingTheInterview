import { app } from 'electron'
import path from 'path'

export function getAppIconPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'icon.png')
  }
  return path.join(__dirname, '../../resources/icon.png')
}
