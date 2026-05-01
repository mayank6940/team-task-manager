import { Router, Request, Response } from 'express'
import prisma from '../prismaClient'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const memberships = await prisma.projectMember.findMany({ where: { userId: (req as any).user.id } })
    const projectIds = memberships.map(m => m.projectId)

    const where: any = { projectId: { in: projectIds } }

    const total = await prisma.task.count({ where })
    const byStatus: Record<string, number> = {}
    const statuses = ['TODO', 'IN_PROGRESS', 'DONE']
    for (const s of statuses) {
      byStatus[s] = await prisma.task.count({ where: { ...where, status: s } })
    }

    const now = new Date()
    const overdue = await prisma.task.findMany({ where: { ...where, dueDate: { lt: now }, NOT: { status: 'DONE' } } })

    const assignedToMe = await prisma.task.findMany({ where: { ...where, assignedToId: (req as any).user.id } })

    return res.json({ total, byStatus, overdue, assignedToMe })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
