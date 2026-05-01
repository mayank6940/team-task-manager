import { Request, Response, NextFunction } from 'express'

export function requireAdmin(req: Request & { user?: any }, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Admin only' })
  next()
}
