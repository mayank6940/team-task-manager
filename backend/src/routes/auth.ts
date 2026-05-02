import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient'
import verifyToken from '../middleware/verifyToken'

const router = Router()

router.post(
  '/signup',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body as any
    try {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return res.status(400).json({ message: 'Email already in use' })

      const hashed = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({ data: { name, email, password: hashed } })

      const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role }
      return res.status(201).json({ user: safeUser })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)

router.post(
  '/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body as any
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(401).json({ message: 'Invalid credentials' })

      const ok = await bcrypt.compare(password, user.password)
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

      const payload = { id: user.id, role: user.role, name: user.name, email: user.email }
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '8h' })

      const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role }
      return res.json({ token, user: safeUser })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)

router.get('/users', verifyToken as any, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } })
    return res.json(users)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.get('/users/:id', verifyToken as any, async (req: Request, res: Response) => {
  const { id } = req.params
  const currentUser = (req as any).user

  // Privacy Check: Only Admins can view other users' profiles
  if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
    return res.status(403).json({ message: 'Forbidden: You can only view your own profile.' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const memberships = await prisma.projectMember.findMany({
      where: { userId: id },
      include: { project: true }
    })

    const tasks = await prisma.task.findMany({
      where: { assignedToId: id }
    })

    const stats = {
      totalTasks: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: tasks.filter(t => t.status === 'DONE').length,
      projectCount: memberships.length,
      projects: memberships.map(m => m.project)
    }

    return res.json({ user, stats })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
