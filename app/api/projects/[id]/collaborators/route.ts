
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

type Props = {
    params: Promise<{ id: string }>;
};

// GET: List collaborators
export async function GET(
    req: Request,
    props: Props
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;

    try {
        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return new NextResponse('Project not found or unauthorized', { status: 404 });
        }

        const collaborators = await prisma.collaborator.findMany({
            where: { projectId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(collaborators);
    } catch (error) {
        console.error('[PROJECT_COLLABORATORS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// PATCH: Update collaborator role
export async function PATCH(
    req: Request,
    props: Props
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();
    const { collaboratorId, role } = body;

    if (!['VIEWER', 'EDITOR'].includes(role)) {
        return new NextResponse('Invalid role', { status: 400 });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return new NextResponse('Project not found or unauthorized', { status: 404 });
        }

        const updatedCollaborator = await prisma.collaborator.update({
            where: { id: collaboratorId },
            data: { role },
        });

        return NextResponse.json(updatedCollaborator);
    } catch (error) {
        console.error('[PROJECT_COLLABORATORS_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// DELETE: Remove collaborator
export async function DELETE(
    req: Request,
    props: Props
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;
    const url = new URL(req.url);
    const collaboratorId = url.searchParams.get('collaboratorId');

    if (!collaboratorId) {
        return new NextResponse('Collaborator ID is required', { status: 400 });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return new NextResponse('Project not found or unauthorized', { status: 404 });
        }

        await prisma.collaborator.delete({
            where: { id: collaboratorId },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[PROJECT_COLLABORATORS_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
