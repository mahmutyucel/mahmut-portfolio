import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: any }

function getBestDbPath(): string {
  const candidates = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(process.cwd(), 'dev.db'),
    path.resolve('prisma/dev.db'),
    path.resolve('dev.db')
  ]
  const sourceDb = candidates.find(p => fs.existsSync(p) && fs.statSync(p).size > 4096)

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDb = '/tmp/dev.db'
    if (sourceDb) {
      const tmpSize = fs.existsSync(tmpDb) ? fs.statSync(tmpDb).size : 0
      if (tmpSize < fs.statSync(sourceDb).size) {
        try { fs.copyFileSync(sourceDb, tmpDb) } catch {}
      }
      if (fs.existsSync(tmpDb) && fs.statSync(tmpDb).size > 4096) return tmpDb
      return sourceDb
    }
  }
  return sourceDb || (process.env.DATABASE_URL || 'file:./dev.db').replace(/^file:/, '')
}

function getClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  const dbPath = getBestDbPath()
  if (!fs.existsSync(dbPath)) return null

  for (const urlOpt of [dbPath, `file:${dbPath}`]) {
    try {
      const adapter = new PrismaBetterSqlite3({ url: urlOpt })
      const client = new PrismaClient({ adapter })
      globalForPrisma.prisma = client
      return client
    } catch {}
  }
  return null
}

export const prisma: PrismaClient = new Proxy({} as any, {
  get(_target, prop: string | symbol) {
    return new Proxy(() => {}, {
      get(_mTarget, method: string | symbol) {
        return async (...args: any[]) => {
          try {
            const client = getClient()
            if (!client || !client[prop] || typeof client[prop][method] !== 'function') {
              return method === 'findMany' ? [] : method === 'count' ? 0 : null
            }
            return await client[prop][method](...args)
          } catch {
            return method === 'findMany' ? [] : method === 'count' ? 0 : null
          }
        }
      }
    })
  }
})