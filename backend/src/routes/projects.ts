import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import prisma from '../prismaClient'
import { requireAdmin } from '../middleware/roles'

const router = Router()

router.post(
  '/',
  requireAdmin,
  body('name').isLength({ min: 2 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, description, priority } = req.body as any
    try {
      const creatorId = (req as any).user?.id
      if (!creatorId) return res.status(401).json({ message: 'Invalid token' })

      const creator = await prisma.user.findUnique({ where: { id: creatorId } })
      if (!creator) return res.status(401).json({ message: 'User not found' })

      const project = await prisma.project.create({ data: { name, description, priority: priority || 'MEDIUM' } })
      // add creator as member
      await prisma.projectMember.create({ data: { projectId: project.id, userId: creatorId } })
      return res.status(201).json(project)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)

router.get('/', async (req: Request, res: Response) => {
  try {
    const memberships = await prisma.projectMember.findMany({ where: { userId: (req as any).user.id }, include: { project: true } })
    const projects = memberships.map((m) => m.project)
    return res.json({ projects })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  const projectId = req.params.id
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: { include: { user: true } },
        tasks: true
      }
    })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    // ensure requester is a member
    const mem = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId: (req as any).user.id, projectId } } })
    if (!mem) return res.status(403).json({ message: 'Not a project member' })

    const members = project.members.map((m) => (m.user))
    return res.json({ project: { id: project.id, name: project.name, description: project.description, createdAt: project.createdAt }, members, tasks: project.tasks })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.post('/:id/members', requireAdmin, body('email').isEmail(), async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const projectId = req.params.id
  const { email } = req.body as any
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) return res.status(404).json({ message: 'Project not found' })

    await prisma.projectMember.create({ data: { projectId, userId: user.id } })
    return res.status(201).json({ message: 'Member added' })
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(400).json({ message: 'User already a member' })
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id/members/:userId', requireAdmin, async (req: Request, res: Response) => {
  const projectId = req.params.id
  const userId = req.params.userId
  try {
    await prisma.projectMember.deleteMany({ where: { projectId, userId } })
    return res.json({ message: 'Member removed' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.patch('/:id', requireAdmin, async (req: Request, res: Response) => {
  const projectId = req.params.id
  const { name, description, priority } = req.body as any
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { ...(name && { name }), ...(description && { description }), ...(priority && { priority }) }
    })
    return res.json(project)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const projectId = req.params.id
  try {
    await prisma.task.deleteMany({ where: { projectId } })
    await prisma.projectMember.deleteMany({ where: { projectId } })
    await prisma.project.delete({ where: { id: projectId } })
    return res.json({ message: 'Project deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
