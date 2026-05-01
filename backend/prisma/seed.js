const bcrypt = require('bcrypt')
const prisma = require('../src/prismaClient')

async function main() {
  console.log('Seeding database...')

  const adminPassword = await bcrypt.hash('AdminPass123', 10)
  const memberPassword = await bcrypt.hash('MemberPass123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@example.com', password: adminPassword, role: 'ADMIN' }
  })

  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: { name: 'Member', email: 'member@example.com', password: memberPassword }
  })

  const project = await prisma.project.upsert({
    where: { name: 'Example Project' },
    update: {},
    create: { name: 'Example Project', description: 'Seeded project' }
  })

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: admin.id, projectId: project.id } },
    update: {},
    create: { userId: admin.id, projectId: project.id }
  })

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: member.id, projectId: project.id } },
    update: {},
    create: { userId: member.id, projectId: project.id }
  })

  await prisma.task.upsert({
    where: { title: 'Welcome Task' },
    update: {},
    create: {
      title: 'Welcome Task',
      description: 'This is a seeded task',
      projectId: project.id,
      assignedToId: member.id,
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      createdById: admin.id
    }
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
