import { Request, Response, NextFunction } from 'express'
import prisma from '../prismaClient'

export default async function ensureProjectMember(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const projectId = (req.params as any).projectId || (req.params as any).id || (req.body as any).projectId
  if (!projectId) return res.status(400).json({ message: 'Missing project id' })
  try {
    const mem = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId: req.user.id, projectId } } })
    if (!mem) return res.status(403).json({ message: 'Not a project member' })
    next()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
