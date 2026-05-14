import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { readdirSync, statSync } from 'fs'
import { extname } from 'path'
import { pathToFileURL } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { parseFile } from 'music-metadata'
import icon from '../../resources/icon.png?asset'

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac']
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png']

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // IPC handler for selecting audio folder
  ipcMain.handle('select-audio-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Audio Folder'
    })
    return {
      canceled: result.canceled,
      filePath: result.filePaths[0] || null
    }
  })

  // IPC handler for getting audio files from folder
  ipcMain.handle('get-audio-files', async (event, folderPath) => {
    try {
      const files = readdirSync(folderPath)
      const audioFiles = files
        .filter((file) => {
          const ext = extname(file).toLowerCase()
          return AUDIO_EXTENSIONS.includes(ext)
        })
        .map((file) => {
          const filePath = join(folderPath, file)
          return {
            name: file,
            path: filePath,
            url: pathToFileURL(filePath).href
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

      return audioFiles
    } catch (error) {
      console.error('Error reading folder:', error)
      return []
    }
  })

  // IPC handler for analyzing music library
  ipcMain.handle('analyze-music-library', async (event, rootPath) => {
    let idCounter = 0
    const generateId = (prefix) => `${prefix}_${++idCounter}`

    const normalizeGenres = (genreData) => {
      if (!genreData) return null
      const genres = Array.isArray(genreData) ? genreData : [genreData]
      const cleaned = genres
        .map((value) => (typeof value === 'string' ? value.trim() : String(value).trim()))
        .filter(Boolean)
      return cleaned.length ? Array.from(new Set(cleaned)) : null
    }

    const library = {
      artists: {},
      idMap: {}
    }

    const scanImageFiles = (folderPath) => {
      try {
        const files = readdirSync(folderPath)
        return files
          .filter((file) => {
            const ext = extname(file).toLowerCase()
            return IMAGE_EXTENSIONS.includes(ext)
          })
          .map((file) => ({
            id: generateId('image'),
            name: file,
            path: join(folderPath, file)
          }))
      } catch (error) {
        console.warn(`Could not scan images in ${folderPath}:`, error.message)
        return []
      }
    }

    const scanDirectory = async (dirPath) => {
      try {
        const entries = readdirSync(dirPath)
        for (const entry of entries) {
          const fullPath = join(dirPath, entry)
          const stat = statSync(fullPath)

          if (stat.isDirectory()) {
            // Recursively scan subdirectories
            await scanDirectory(fullPath)
          } else if (stat.isFile()) {
            const ext = extname(entry).toLowerCase()
            if (AUDIO_EXTENSIONS.includes(ext)) {
              try {
                const metadata = await parseFile(fullPath)
                const artistName = metadata.common?.artist || 'Unknown Artist'
                const albumName = metadata.common?.album || 'Unknown Album'
                const title = metadata.common?.title || entry.replace(ext, '')
                const year = metadata.common?.year || 0
                const genres = normalizeGenres(metadata.common?.genre)
                const albumDir = dirPath
                const artistDir = dirPath === rootPath ? dirPath : join(dirPath, '..')

                // Ensure artist exists
                if (!library.artists[artistName]) {
                  const artistId = generateId('artist')
                  library.artists[artistName] = {
                    id: artistId,
                    name: artistName,
                    albums: {},
                    folderPath: artistDir,
                    artistImages: scanImageFiles(artistDir)
                  }
                  library.idMap[artistId] = { type: 'artist', name: artistName }
                } else {
                  // Ensure artistImages array exists even if artist was created without images
                  if (!library.artists[artistName].artistImages) {
                    library.artists[artistName].artistImages = scanImageFiles(library.artists[artistName].folderPath)
                  }
                }

                // Ensure album exists
                if (!library.artists[artistName].albums[albumName]) {
                  const albumId = generateId('album')
                  library.artists[artistName].albums[albumName] = {
                    id: albumId,
                    name: albumName,
                    artist: artistName,
                    year: year,
                    genres: genres,
                    tracks: {},
                    folderPath: albumDir,
                    albumImages: scanImageFiles(albumDir)
                  }
                  library.idMap[albumId] = {
                    type: 'album',
                    name: albumName,
                    artist: artistName
                  }
                } else {
                  // Ensure albumImages array exists even if album was created without images
                  if (!library.artists[artistName].albums[albumName].albumImages) {
                    library.artists[artistName].albums[albumName].albumImages = scanImageFiles(library.artists[artistName].albums[albumName].folderPath)
                  }
                  // Merge genres if they exist
                  if (genres) {
                    const album = library.artists[artistName].albums[albumName]
                    album.genres = album.genres
                      ? Array.from(new Set([...album.genres, ...genres]))
                      : genres
                  }
                }

                // Add track
                const trackId = generateId('track')
                library.artists[artistName].albums[albumName].tracks[title] = {
                  id: trackId,
                  title: title,
                  artist: artistName,
                  album: albumName,
                  duration: metadata.format?.duration || 0,
                  filePath: fullPath,
                  fileName: entry,
                  fileType: ext
                }
                library.idMap[trackId] = {
                  type: 'track',
                  title: title,
                  filePath: fullPath
                }
              } catch (err) {
                console.warn(`Could not parse metadata for ${fullPath}:`, err.message)
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dirPath}:`, error)
      }
    }

    await scanDirectory(rootPath)
    return library
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
