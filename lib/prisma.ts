import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: any }

function findSourceDb(): string | null {
  const candidates = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(process.cwd(), 'dev.db'),
    path.resolve('prisma/dev.db'),
    path.resolve('dev.db')
  ]
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).size > 0) return c
  }
  return null
}

function getDbFilePath(): string {
  const src = findSourceDb()
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDb = '/tmp/dev.db'
    if (src && (!fs.existsSync(tmpDb) || fs.statSync(tmpDb).size === 0)) {
      try { fs.copyFileSync(src, tmpDb) } catch {}
    }
    if (fs.existsSync(tmpDb) && fs.statSync(tmpDb).size > 0) return tmpDb
    if (src) return src
  }
  return src || (process.env.DATABASE_URL || 'file:./dev.db').replace(/^file:/, '')
}

function initClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  const dbPath = getDbFilePath()
  if (!fs.existsSync(dbPath)) return null

  // PrismaBetterSqlite3 surumune gore hem plain path hem file: URL formatini dene
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
            const client = initClient()
            if (!client || !client[prop] || typeof client[prop][method] !== 'function') {
              return method === 'findMany' ? [] : method === 'count' ? 0 : null
            }
            return await client[prop][method](...args)
          } catch (e) {
            console.error('Prisma query error:', e)
            return method === 'findMany' ? [] : method === 'count' ? 0 : null
          }
        }
      }
    })
  }
})