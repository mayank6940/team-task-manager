import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import verifyToken from '../src/middleware/verifyToken'
import { requireAdmin } from '../src/middleware/roles'

process.env.JWT_SECRET = 'testsecret'

describe('middleware', () => {
  test('verifyToken accepts valid token and sets req.user', (done) => {
    const payload = { id: 'u1', role: 'MEMBER', email: 'a@b.com', name: 'A' }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string)

    const req = { headers: { authorization: `Bearer ${token}` } } as any
    const res = {} as Response
    verifyToken(req, res, () => {
      try {
        expect(req.user).toBeDefined()
        expect(req.user.id).toBe(payload.id)
        done()
      } catch (e) {
        done(e as any)
      }
    })
  })

  test('verifyToken rejects invalid token', () => {
    const req = { headers: { authorization: `Bearer bad.token` } } as any
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response
    const next = jest.fn()
    verifyToken(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  test('requireAdmin allows admin and rejects non-admin', () => {
    const req1 = { user: { role: 'ADMIN' } } as any
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response
    const next = jest.fn()
    requireAdmin(req1, res, next)
    expect(next).toHaveBeenCalled()

    const req2 = { user: { role: 'MEMBER' } } as any
    requireAdmin(req2, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
  })
})
