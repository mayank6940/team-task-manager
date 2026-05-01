import bcrypt from 'bcrypt'
import prisma from '../src/prismaClient'

async function main() {
  console.log('Seeding database...')

  const adminPassword = await bcrypt.hash('AdminPass123', 10)
  const memberPassword = await bcrypt.hash('MemberPass123', 10)

  // Delete existing seed data to start fresh
  await prisma.task.deleteMany({})
  await prisma.projectMember.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.user.deleteMany({})

  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@example.com', password: adminPassword, role: 'ADMIN' }
  })

  const member = await prisma.user.create({
    data: { name: 'Member', email: 'member@example.com', password: memberPassword, role: 'MEMBER' }
  })

  const project = await prisma.project.create({
    data: { name: 'Example Project', description: 'Seeded project' }
  })

  await prisma.projectMember.create({
    data: { userId: admin.id, projectId: project.id }
  })

  await prisma.projectMember.create({
    data: { userId: member.id, projectId: project.id }
  })

  await prisma.task.create({
    data: {
      title: 'Welcome Task',
      description: 'This is a seeded task',
      projectId: project.id,
      assignedToId: member.id,
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      createdById: admin.id
    }
  })

  console.log('✅ Seeding complete.')
  console.log('Admin: admin@example.com / AdminPass123')
  console.log('Member: member@example.com / MemberPass123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
