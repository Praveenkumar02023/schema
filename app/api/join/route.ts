
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST: Join a project via token (Global Lookup)
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { token } = body;

    if (!token) {
        return new NextResponse('Token is required', { status: 400 });
    }

    try {
        // Find project with matching token
        const project = await prisma.project.findFirst({
            where: {
                OR: [
                    { viewToken: token },
                    { editToken: token },
                ],
            },
        });

        if (!project) {
            return new NextResponse('Invalid or expired token', { status: 404 });
        }

        // Determine role based on which token matched
        let role: 'VIEWER' | 'EDITOR' = 'VIEWER';
        if (project.editToken === token) {
            role = 'EDITOR';
        }

        const projectId = project.id;
        const userId = session.user.id;

        // Check if user is already a collaborator
        const existingCollaborator = await prisma.collaborator.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
        });

        if (existingCollaborator) {
            // Upgrade role if needed
            if (role === 'EDITOR' && existingCollaborator.role === 'VIEWER') {
                await prisma.collaborator.update({
                    where: { id: existingCollaborator.id },
                    data: { role: 'EDITOR' },
                });
                return NextResponse.json({ projectId: project.id, role: 'EDITOR' });
            }
            return NextResponse.json({ projectId: project.id, role: existingCollaborator.role });
        }

        // Check if user is the owner
        if (project.userId === userId) {
            return NextResponse.json({ projectId: project.id, role: 'OWNER' });
        }

        // Add as collaborator
        await prisma.collaborator.create({
            data: {
                userId,
                projectId,
                role,
            },
        });

        return NextResponse.json({ projectId: project.id, role });
    } catch (error) {
        console.error('[JOIN_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
