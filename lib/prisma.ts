import { PrismaClient } from '@prisma/client'
import backupData from '../data/db-backup.json'

function hydrateRow(row: any) {
  if (!row || typeof row !== 'object') return row
  const out: any = { ...row }
  for (const [k, v] of Object.entries(out)) {
    if (typeof v === 'string' && (/At$|Date$|Tarih/i.test(k) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v))) {
      const d = new Date(v)
      if (!isNaN(d.getTime())) out[k] = d
    }
  }
  return out
}

function getBackupRows(modelName: string): any[] {
  const data = (backupData || {}) as Record<string, any[]>
  const key = modelName.toLowerCase()
  let rows: any[] = []

  if (Array.isArray(data[key])) rows = data[key]
  else if (Array.isArray(data[key + 's'])) rows = data[key + 's']
  else if (key.endsWith('y') && Array.isArray(data[key.slice(0, -1) + 'ies'])) rows = data[key.slice(0, -1) + 'ies']
  else {
    const match = Object.keys(data).find(k => k.toLowerCase().includes(key) || key.includes(k.toLowerCase()))
    if (match && Array.isArray(data[match])) rows = data[match]
  }

  return rows.map(hydrateRow)
}

export const prisma: PrismaClient = new Proxy({} as any, {
  get(_target, prop: string | symbol) {
    const modelName = String(prop)
    if (modelName.startsWith('$') || modelName === 'then') return undefined

    return new Proxy(() => {}, {
      get(_mTarget, method: string | symbol) {
        const methodName = String(method)
        return async (args?: any) => {
          let rows = getBackupRows(modelName)

          if (args?.where && typeof args.where === 'object') {
            rows = rows.filter(r =>
              Object.entries(args.where).every(([wk, wv]) => wv === undefined || r[wk] === wv)
            )
          }

          if (args?.orderBy && typeof args.orderBy === 'object') {
            const entries = Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy]
            for (const ord of entries.reverse()) {
              const [ok, dir] = Object.entries(ord)[0] || []
              if (ok) {
                rows = [...rows].sort((a, b) => {
                  if (a[ok] < b[ok]) return dir === 'desc' ? 1 : -1
                  if (a[ok] > b[ok]) return dir === 'desc' ? -1 : 1
                  return 0
                })
              }
            }
          }

          if (args?.take && typeof args.take === 'number') {
            rows = rows.slice(0, args.take)
          }

          if (methodName === 'findMany') return rows
          if (methodName === 'findFirst' || methodName === 'findUnique') return rows[0] || null
          if (methodName === 'count') return rows.length
          return rows[0] || null
        }
      }
    })
  }
})