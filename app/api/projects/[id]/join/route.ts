
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

type Props = {
    params: Promise<{ id: string }>;
};

// POST: Join a project via token
export async function POST(
    req: Request,
    props: Props
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();
    const { token } = body;

    if (!token) {
        return new NextResponse('Token is required', { status: 400 });
    }

    try {
        // Find project with matching token
        const project = await prisma.project.findFirst({
            where: {
                id,
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

        // Check if user is already a collaborator
        const existingCollaborator = await prisma.collaborator.findUnique({
            where: {
                userId_projectId: {
                    userId: session.user.id,
                    projectId: id,
                },
            },
        });

        if (existingCollaborator) {
            // Update role if joining with a higher privilege token (e.g. was Viewer, now joining as Editor)
            if (role === 'EDITOR' && existingCollaborator.role === 'VIEWER') {
                await prisma.collaborator.update({
                    where: { id: existingCollaborator.id },
                    data: { role: 'EDITOR' },
                });
                return NextResponse.json({ projectId: id, role: 'EDITOR' });
            }
            return NextResponse.json({ projectId: id, role: existingCollaborator.role });
        }

        // Check if user is the owner
        if (project.userId === session.user.id) {
            return NextResponse.json({ projectId: id, role: 'OWNER' });
        }

        // Add as collaborator
        await prisma.collaborator.create({
            data: {
                userId: session.user.id,
                projectId: id,
                role,
            },
        });

        return NextResponse.json({ projectId: id, role });
    } catch (error) {
        console.error('[PROJECT_JOIN_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
