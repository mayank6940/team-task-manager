import prisma from '../prismaClient'

export async function logActivity(type: string, message: string, userId: string, projectId?: string, taskId?: string) {
  try {
    await prisma.activity.create({
      data: {
        type,
        message,
        userId,
        projectId,
        taskId
      }
    })
  } catch (err) {
    console.error('Failed to log activity:', err)
  }
}
