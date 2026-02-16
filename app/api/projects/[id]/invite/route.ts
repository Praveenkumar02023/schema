
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

type Props = {
    params: Promise<{ id: string }>;
};

// POST: Generate or Regenerate share links
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
    const { type } = body; // 'view' or 'edit'

    if (!type || !['view', 'edit'].includes(type)) {
        return new NextResponse('Invalid link type', { status: 400 });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return new NextResponse('Project not found or unauthorized', { status: 404 });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const updateData = type === 'view'
            ? { viewToken: token }
            : { editToken: token };

        const updatedProject = await prisma.project.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            viewToken: updatedProject.viewToken,
            editToken: updatedProject.editToken,
        });
    } catch (error) {
        console.error('[PROJECT_INVITE_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// DELETE: Revoke share links
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
    const type = url.searchParams.get('type'); // 'view' or 'edit'

    if (!type || !['view', 'edit'].includes(type)) {
        return new NextResponse('Invalid link type', { status: 400 });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return new NextResponse('Project not found or unauthorized', { status: 404 });
        }

        const updateData = type === 'view'
            ? { viewToken: null }
            : { editToken: null };

        const updatedProject = await prisma.project.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            viewToken: updatedProject.viewToken,
            editToken: updatedProject.editToken,
        });
    } catch (error) {
        console.error('[PROJECT_INVITE_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
