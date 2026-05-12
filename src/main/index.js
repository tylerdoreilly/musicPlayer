import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { readdirSync, statSync } from 'fs'
import { extname } from 'path'
import { pathToFileURL } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { parseFile } from 'music-metadata'
import axios from 'axios'
import icon from '../../resources/icon.png?asset'

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac']

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

    // Rate limiter: ensure 1 request per second to MusicBrainz
    let lastRequestTime = 0
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const rateLimitedRequest = async (fn) => {
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTime
      if (timeSinceLastRequest < 1000) {
        await delay(1000 - timeSinceLastRequest)
      }
      lastRequestTime = Date.now()
      return fn()
    }

    // Create axios instance for MusicBrainz
    const mbAxios = axios.create({
      baseURL: 'https://musicbrainz.org/ws/2',
      headers: {
        'User-Agent': 'MusicClubApp/1.0.0 (https://github.com/tyler-app)',
        'Accept': 'application/json'
      },
      timeout: 10000
    })

    // Create axios instance for CoverArt Archive
    const caAxios = axios.create({
      baseURL: 'https://coverartarchive.org',
      timeout: 5000
    })

    const normalizeGenres = (genreData) => {
      if (!genreData) return null
      const genres = Array.isArray(genreData) ? genreData : [genreData]
      const cleaned = genres
        .map((value) => (typeof value === 'string' ? value.trim() : String(value).trim()))
        .filter(Boolean)
      return cleaned.length ? Array.from(new Set(cleaned)) : null
    }

    // Search for artist on MusicBrainz
    const searchArtist = async (artistName) => {
      try {
        return await rateLimitedRequest(async () => {
          const response = await mbAxios.get('/artist', {
            params: {
              query: artistName,
              limit: 1,
              fmt: 'json'
            }
          })
          return response.data.artists?.[0] || null
        })
      } catch (err) {
        console.warn(`Failed to search artist "${artistName}":`, err.message)
        return null
      }
    }

    // Get artist details from MusicBrainz
    const getArtistDetails = async (mbid) => {
      try {
        return await rateLimitedRequest(async () => {
          const response = await mbAxios.get(`/artist/${mbid}`, {
            params: {
              inc: 'releases+tags+genres',
              fmt: 'json'
            }
          })
          return response.data
        })
      } catch (err) {
        console.warn(`Failed to get artist details for MBID "${mbid}":`, err.message)
        return null
      }
    }

    // Search for album on MusicBrainz
    const searchAlbum = async (albumName, artistName) => {
      try {
        return await rateLimitedRequest(async () => {
          const query = `${albumName} artist:${artistName}`
          const response = await mbAxios.get('/release', {
            params: {
              query: query,
              limit: 1,
              fmt: 'json'
            }
          })
          return response.data.releases?.[0] || null
        })
      } catch (err) {
        console.warn(`Failed to search album "${albumName}":`, err.message)
        return null
      }
    }

    // Get release (album) details from MusicBrainz
    const getReleaseDetails = async (mbid) => {
      try {
        return await rateLimitedRequest(async () => {
          const response = await mbAxios.get(`/release/${mbid}`, {
            params: {
              inc: 'recordings+tags+genres',
              fmt: 'json'
            }
          })
          return response.data
        })
      } catch (err) {
        console.warn(`Failed to get release details for MBID "${mbid}":`, err.message)
        return null
      }
    }

    // Get cover art for release
    const getCoverArt = async (releaseMbid) => {
      try {
        return await rateLimitedRequest(async () => {
          const response = await caAxios.get(`/release/${releaseMbid}`)
          return response.data.images || []
        })
      } catch (err) {
        console.warn(`Failed to get cover art for release "${releaseMbid}":`, err.message)
        return []
      }
    }

    // Get artist image from MusicBrainz relationships
    const getArtistImage = async (artistMbid) => {
      try {
        return await rateLimitedRequest(async () => {
          const response = await mbAxios.get(`/artist/${artistMbid}`, {
            params: {
              inc: 'url-rels',
              fmt: 'json'
            }
          })
          const relations = response.data.relations || []
          const imageRel = relations.find((rel) => rel.type === 'image')
          return imageRel?.url?.resource || null
        })
      } catch (err) {
        console.warn(`Failed to get artist image for MBID "${artistMbid}":`, err.message)
        return null
      }
    }

    const library = {
      artists: {},
      idMap: {}
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

                // Ensure artist exists
                if (!library.artists[artistName]) {
                  const artistId = generateId('artist')
                  let artistMbid = null
                  let musicBrainzData = {
                    mbid: null,
                    image: null
                  }

                  // Try to get MusicBrainz data
                  if (artistName !== 'Unknown Artist') {
                    const artistSearch = await searchArtist(artistName)
                    if (artistSearch) {
                      artistMbid = artistSearch.id
                      musicBrainzData.mbid = artistMbid
                      // Try to get image
                      const artistImage = await getArtistImage(artistMbid)
                      if (artistImage) {
                        musicBrainzData.image = artistImage
                      }
                    }
                  }

                  library.artists[artistName] = {
                    id: artistId,
                    name: artistName,
                    mbid: artistMbid,
                    musicBrainz: musicBrainzData,
                    albums: {},
                    folderPath: dirPath
                  }
                  library.idMap[artistId] = { type: 'artist', name: artistName }
                }

                // Ensure album exists
                if (!library.artists[artistName].albums[albumName]) {
                  const albumId = generateId('album')
                  let albumMbid = null
                  let musicBrainzData = {
                    mbid: null,
                    images: [],
                    genres: null
                  }

                  // Try to get MusicBrainz data
                  if (albumName !== 'Unknown Album') {
                    const albumSearch = await searchAlbum(albumName, artistName)
                    if (albumSearch) {
                      albumMbid = albumSearch.id
                      musicBrainzData.mbid = albumMbid

                      // Get detailed release info
                      const releaseDetails = await getReleaseDetails(albumMbid)
                      if (releaseDetails) {
                        // Get cover art
                        const images = await getCoverArt(albumMbid)
                        if (images.length > 0) {
                          musicBrainzData.images = images.map((img) => ({
                            url: img.image,
                            type: img.types || [],
                            front: img.front || false,
                            back: img.back || false
                          }))
                        }

                        // Get genres from release
                        if (releaseDetails.genres && releaseDetails.genres.length > 0) {
                          const mbGenres = releaseDetails.genres.map((g) => g.name)
                          musicBrainzData.genres = mbGenres
                        }
                      }
                    }
                  }

                  library.artists[artistName].albums[albumName] = {
                    id: albumId,
                    name: albumName,
                    artist: artistName,
                    year: year,
                    genres: genres,
                    mbid: albumMbid,
                    musicBrainz: musicBrainzData,
                    tracks: {},
                    folderPath: dirPath
                  }
                  library.idMap[albumId] = {
                    type: 'album',
                    name: albumName,
                    artist: artistName
                  }
                } else if (genres) {
                  const album = library.artists[artistName].albums[albumName]
                  album.genres = album.genres
                    ? Array.from(new Set([...album.genres, ...genres]))
                    : genres
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
