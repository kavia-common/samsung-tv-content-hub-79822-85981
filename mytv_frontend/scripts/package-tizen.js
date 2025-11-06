#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * package-tizen.js
 * Node-based packager to create a Tizen .wgt (ZIP) archive without requiring the system 'zip' binary.
 *
 * Behavior:
 * - Reads the build output from ./dist/
 * - Includes ./config.xml at the root of the archive
 * - Produces ./app.wgt in the project root (mytv_frontend/)
 *
 * Usage:
 *   npm run package:tizen
 *
 * Notes:
 * - This script writes a ZIP file using the "store" method (no compression) using Node's zlib and manual ZIP file structures.
 *   This avoids adding a third-party dependency in CI where installing system binaries is restricted.
 * - It preserves file paths relative to dist/ for all assets, and adds config.xml at archive root.
 * - It excludes directories and hidden .DS_Store-like files automatically.
 */

import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const configXmlPath = path.join(projectRoot, 'config.xml')
const outputWgt = path.join(projectRoot, 'app.wgt')

/**
 * Recursively collect files from a directory.
 * Returns paths relative to base directory.
 */
function collectFiles(baseDir) {
  const out = []
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const abs = path.join(dir, e.name)
      const rel = path.relative(baseDir, abs)
      // skip hidden meta files
      if (e.name === '.DS_Store' || e.name === 'Thumbs.db') continue
      if (e.isDirectory()) {
        walk(abs)
      } else if (e.isFile()) {
        out.push(rel.split(path.sep).join('/')) // use forward slashes
      }
    }
  }
  walk(baseDir)
  return out
}

/**
 * Zip helper implementing "store" method (no compression) for simplicity and zero external dependencies.
 * Writes a valid ZIP per spec with central directory.
 */
function crc32(buffer) {
  // Node doesn't expose CRC32, implement via table
  const table = new Uint32Array(256).map((_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    return c >>> 0
  })
  let crc = 0 ^ -1
  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xFF]
  }
  return (crc ^ -1) >>> 0
}

function writeUInt16LE(num) {
  const b = Buffer.alloc(2)
  b.writeUInt16LE(num, 0)
  return b
}

function writeUInt32LE(num) {
  const b = Buffer.alloc(4)
  b.writeUInt32LE(num, 0)
  return b
}

function dosDateTime(date = new Date()) {
  // DOS time: bits (h << 11) | (m << 5) | (s/2)
  // DOS date: bits ((year-1980) << 9) | (month << 5) | day
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = Math.floor(date.getSeconds() / 2)
  const dosTime = (hours << 11) | (minutes << 5) | seconds
  const dosDate = ((year - 1980) << 9) | (month << 5) | day
  return { dosTime, dosDate }
}

function createStoredLocalHeader(fileName, data, mtime = new Date()) {
  const nameBuf = Buffer.from(fileName, 'utf8')
  const { dosTime, dosDate } = dosDateTime(mtime)
  const crc = crc32(data)
  const uncompressedSize = data.length
  const compressedSize = data.length // store (no compression)
  const signature = Buffer.from([0x50, 0x4b, 0x03, 0x04]) // local file header signature
  const versionNeeded = writeUInt16LE(20)
  const generalFlag = writeUInt16LE(0)
  const compressionMethod = writeUInt16LE(0) // store
  const modTime = writeUInt16LE(dosTime)
  const modDate = writeUInt16LE(dosDate)
  const crcBuf = writeUInt32LE(crc)
  const compSizeBuf = writeUInt32LE(compressedSize)
  const uncompSizeBuf = writeUInt32LE(uncompressedSize)
  const fileNameLen = writeUInt16LE(nameBuf.length)
  const extraLen = writeUInt16LE(0)

  const header = Buffer.concat([
    signature,
    versionNeeded,
    generalFlag,
    compressionMethod,
    modTime,
    modDate,
    crcBuf,
    compSizeBuf,
    uncompSizeBuf,
    fileNameLen,
    extraLen,
    nameBuf,
  ])

  return { header, crc, compressedSize, uncompressedSize, nameBuf }
}

function createCentralDirectoryRecord(fileName, crc, compressedSize, uncompressedSize, localHeaderOffset, mtime = new Date()) {
  const nameBuf = Buffer.from(fileName, 'utf8')
  const { dosTime, dosDate } = dosDateTime(mtime)
  const signature = Buffer.from([0x50, 0x4b, 0x01, 0x02]) // central dir signature
  const versionMadeBy = writeUInt16LE(20)
  const versionNeeded = writeUInt16LE(20)
  const generalFlag = writeUInt16LE(0)
  const compressionMethod = writeUInt16LE(0)
  const modTime = writeUInt16LE(dosTime)
  const modDate = writeUInt16LE(dosDate)
  const crcBuf = writeUInt32LE(crc)
  const compSizeBuf = writeUInt32LE(compressedSize)
  const uncompSizeBuf = writeUInt32LE(uncompressedSize)
  const fileNameLen = writeUInt16LE(nameBuf.length)
  const extraLen = writeUInt16LE(0)
  const fileCommentLen = writeUInt16LE(0)
  const diskNumber = writeUInt16LE(0)
  const internalAttrs = writeUInt16LE(0)
  const externalAttrs = writeUInt32LE(0)
  const localHeaderOffsetBuf = writeUInt32LE(localHeaderOffset)

  const cd = Buffer.concat([
    signature,
    versionMadeBy,
    versionNeeded,
    generalFlag,
    compressionMethod,
    modTime,
    modDate,
    crcBuf,
    compSizeBuf,
    uncompSizeBuf,
    fileNameLen,
    extraLen,
    fileCommentLen,
    diskNumber,
    internalAttrs,
    externalAttrs,
    localHeaderOffsetBuf,
    nameBuf,
  ])
  return cd
}

function createEndOfCentralDirectory(totalEntries, centralDirSize, centralDirOffset) {
  const signature = Buffer.from([0x50, 0x4b, 0x05, 0x06])
  const diskNumber = writeUInt16LE(0)
  const startDisk = writeUInt16LE(0)
  const entriesThisDisk = writeUInt16LE(totalEntries)
  const totalEntriesBuf = writeUInt16LE(totalEntries)
  const cdSize = writeUInt32LE(centralDirSize)
  const cdOffset = writeUInt32LE(centralDirOffset)
  const commentLen = writeUInt16LE(0)
  return Buffer.concat([
    signature,
    diskNumber,
    startDisk,
    entriesThisDisk,
    totalEntriesBuf,
    cdSize,
    cdOffset,
    commentLen,
  ])
}

function ensureExists(p, type = 'file') {
  if (type === 'dir' && !fs.existsSync(p)) {
    throw new Error(`Directory not found: ${p}`)
  }
  if (type === 'file' && !fs.existsSync(p)) {
    throw new Error(`File not found: ${p}`)
  }
}

async function main() {
  try {
    ensureExists(distDir, 'dir')
    ensureExists(configXmlPath, 'file')

    // prepare output stream
    const out = fs.createWriteStream(outputWgt)
    const fileRecords = []

    let offset = 0

    // Include all files from dist/ (keep relative paths)
    const distFiles = collectFiles(distDir)
    for (const rel of distFiles) {
      const abs = path.join(distDir, rel)
      const data = fs.readFileSync(abs)
      const stat = fs.statSync(abs)
      const { header, crc, compressedSize, uncompressedSize } = createStoredLocalHeader(rel, data, stat.mtime)

      out.write(header)
      out.write(data)

      fileRecords.push({
        fileName: rel,
        crc,
        compressedSize,
        uncompressedSize,
        offset,
        mtime: stat.mtime,
      })
      offset += header.length + data.length
    }

    // Add config.xml at the root
    {
      const rel = 'config.xml'
      const data = fs.readFileSync(configXmlPath)
      const stat = fs.statSync(configXmlPath)
      const { header, crc, compressedSize, uncompressedSize } = createStoredLocalHeader(rel, data, stat.mtime)

      out.write(header)
      out.write(data)

      fileRecords.push({
        fileName: rel,
        crc,
        compressedSize,
        uncompressedSize,
        offset,
        mtime: stat.mtime,
      })
      offset += header.length + data.length
    }

    // Central directory
    const centralDirOffset = offset
    let centralPieces = []
    for (const f of fileRecords) {
      const cd = createCentralDirectoryRecord(
        f.fileName,
        f.crc,
        f.compressedSize,
        f.uncompressedSize,
        f.offset,
        f.mtime
      )
      centralPieces.push(cd)
      offset += cd.length
    }
    const centralBuf = Buffer.concat(centralPieces)
    out.write(centralBuf)

    // End of central directory
    const eocd = createEndOfCentralDirectory(fileRecords.length, centralBuf.length, centralDirOffset)
    out.write(eocd)

    await new Promise((resolve, reject) => {
      out.end(() => resolve())
      out.on('error', reject)
    })

    console.log(`Created ${path.relative(projectRoot, outputWgt)} with ${fileRecords.length} entries`)
  } catch (err) {
    console.error('Packaging failed:', err.message)
    process.exit(1)
  }
}

main()
