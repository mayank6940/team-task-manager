import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import prisma from '../prismaClient'
import { requireAdmin } from '../middleware/roles'

const router = Router()

router.post(
  '/projects/:projectId/tasks',
  requireAdmin,
  body('title').isLength({ min: 1 }),
  body('assignedTo').optional().isString(),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH']).optional(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { projectId } = req.params as any
    const { title, description, assignedTo, dueDate, priority } = req.body as any
    try {
      const project = await prisma.project.findUnique({ where: { id: projectId } })
      if (!project) return res.status(404).json({ message: 'Project not found' })

      const task = await prisma.task.create({
        data: {
          title,
          description,
          projectId,
          assignedToId: assignedTo || null,
          dueDate: dueDate ? new Date(dueDate) : null,
          priority: priority || project.priority,
          createdById: (req as any).user.id
        }
      })
      return res.status(201).json(task)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)

router.get('/projects/:projectId/tasks', async (req: Request, res: Response) => {
  const { projectId } = req.params as any
  try {
    const member = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId: (req as any).user.id, projectId } } })
    if (!member) return res.status(403).json({ message: 'Not a project member' })

    const tasks = await prisma.task.findMany({ where: { projectId } })
    return res.json({ tasks })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.patch('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params as any
  const updates = req.body as any
  try {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    if ((req as any).user.role === 'ADMIN') {
      const updated = await prisma.task.update({ where: { id }, data: { ...updates, dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined } })
      return res.json(updated)
    }

    if (updates.status && task.assignedToId === (req as any).user.id) {
      const updated = await prisma.task.update({ where: { id }, data: { status: updates.status } })
      return res.json(updated)
    }

    return res.status(403).json({ message: 'Forbidden' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/tasks/:id', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params as any
  try {
    await prisma.task.delete({ where: { id } })
    return res.json({ message: 'Task deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
