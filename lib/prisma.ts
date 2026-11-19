import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: any }

function resolveDbPath(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDb = '/tmp/dev.db'
    const candidates = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join(process.cwd(), 'dev.db')
    ]
    for (const src of candidates) {
      if (fs.existsSync(src)) {
        try {
          if (!fs.existsSync(tmpDb) || fs.statSync(tmpDb).size === 0) {
            fs.copyFileSync(src, tmpDb)
          }
        } catch {}
        return fs.existsSync(tmpDb) ? tmpDb : src
      }
    }
    return tmpDb
  }
  return (process.env.DATABASE_URL || 'file:./dev.db').replace(/^file:/, '')
}

function getClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  try {
    const dbPath = resolveDbPath()
    if (!fs.existsSync(dbPath)) return null

    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
    globalForPrisma.prisma = new PrismaClient({ adapter })
    return globalForPrisma.prisma
  } catch {
    return null
  }
}

export const prisma: PrismaClient = new Proxy({} as any, {
  get(_target, prop: string | symbol) {
    return new Proxy(() => {}, {
      get(_mTarget, method: string | symbol) {
        return async (...args: any[]) => {
          try {
            const client = getClient()
            if (!client || !client[prop] || typeof client[prop][method] !== 'function') {
              if (method === 'findMany') return []
              if (method === 'count') return 0
              return null
            }
            return await client[prop][method](...args)
          } catch {
            if (method === 'findMany') return []
            if (method === 'count') return 0
            return null
          }
        }
      }
    })
  }
})