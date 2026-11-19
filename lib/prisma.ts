import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: any }

function createSafePrisma() {
  try {
    let dbPath = (process.env.DATABASE_URL || 'file:./dev.db').replace(/^file:/, '')

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
          break
        }
      }
      dbPath = fs.existsSync(tmpDb) ? tmpDb : (candidates.find(c => fs.existsSync(c)) || tmpDb)
    }

    const adapter = new PrismaBetterSqlite3({ url: dbPath })
    const client = new PrismaClient({ adapter })

    return new Proxy(client, {
      get(target: any, prop: string | symbol) {
        const val = target[prop]
        if (typeof val === 'object' && val !== null) {
          return new Proxy(val, {
            get(modelTarget: any, method: string | symbol) {
              const fn = modelTarget[method]
              if (typeof fn === 'function') {
                return async (...args: any[]) => {
                  try {
                    return await fn.apply(modelTarget, args)
                  } catch (err) {
                    console.error(`Prisma fallback (${String(prop)}.${String(method)}):`, err)
                    if (method === 'findMany') return []
                    if (method === 'count') return 0
                    return null
                  }
                }
              }
              return fn
            }
          })
        }
        return typeof val === 'function' ? val.bind(target) : val
      }
    })
  } catch (e) {
    console.error('Prisma init fallback:', e)
    return new Proxy({}, {
      get: () => ({
        findMany: async () => [],
        findFirst: async () => null,
        findUnique: async () => null,
        count: async () => 0,
        create: async () => null,
        update: async () => null,
        delete: async () => null,
        upsert: async () => null,
      })
    })
  }
}

export const prisma: PrismaClient = globalForPrisma.prisma || createSafePrisma()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma