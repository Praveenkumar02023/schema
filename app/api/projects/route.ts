
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                tables: {
                    include: {
                        columns: true,
                    }
                },
                relations: true,
            },
            orderBy: {
                lastEdited: 'desc',
            },
        });

        // Transform dates to strings for the frontend
        const formattedProjects = projects.map((project) => ({
            ...project,
            createdAt: project.createdAt.toISOString(),
            lastEdited: project.lastEdited.toISOString(),
            tables: project.tables.map((table: any) => ({
                ...table,
                position: { x: table.x, y: table.y },
            })),
        }));

        return NextResponse.json(formattedProjects);
    } catch (error) {
        console.error('[PROJECTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, color, databaseType } = body;

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        const project = await prisma.project.create({
            data: {
                name,
                color: color || 'blue',
                databaseType: databaseType || 'PostgreSQL',
                userId: session.user.id,
            },
            include: {
                tables: true,
                relations: true,
            },
        });

        const formattedProject = {
            ...project,
            createdAt: project.createdAt.toISOString(),
            lastEdited: project.lastEdited.toISOString(),
        };

        return NextResponse.json(formattedProject);
    } catch (error) {
        console.error('[PROJECTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
