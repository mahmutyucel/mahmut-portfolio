import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function getSqlitePath(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDb = '/tmp/dev.db'
    if (!fs.existsSync(tmpDb)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db')
      ]
      for (const src of candidates) {
        if (fs.existsSync(src)) {
          try { fs.copyFileSync(src, tmpDb) } catch {}
          break
        }
      }
    }
    return tmpDb
  }
  const rawUrl = process.env.DATABASE_URL || 'file:./dev.db'
  return rawUrl.replace(/^file:/, '')
}

function createPrismaClient() {
  const dbPath = getSqlitePath()
  const adapter = new PrismaBetterSqlite3({ url: dbPath })
  return new PrismaClient({ adapter })
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    return Reflect.get(globalForPrisma.prisma, prop)
  }
})