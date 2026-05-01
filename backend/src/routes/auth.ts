import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient'

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

export default router
