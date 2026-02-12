
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

type Props = {
    params: Promise<{ id: string }>;
};

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
            where: {
                id,
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
        });

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        const formattedProject = {
            ...project,
            createdAt: project.createdAt.toISOString(),
            lastEdited: project.lastEdited.toISOString(),
            tables: project.tables.map((table: any) => ({
                ...table,
                position: { x: table.x, y: table.y },
            })),
        };

        return NextResponse.json(formattedProject);
    } catch (error) {
        console.error('[PROJECT_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PUT(
    req: Request,
    props: Props
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();
    const { name, tables, relations, color, databaseType } = body;

    try {
        // Verify ownership
        const existingProject = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!existingProject) {
            return new NextResponse('Project not found', { status: 404 });
        }

        // Transaction to update everything safely
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Update project metadata
            const updatedProject = await tx.project.update({
                where: { id },
                data: {
                    name,
                    color,
                    databaseType,
                },
            });

            // 2. Clear existing structure (Schema Refresh)
            // Delete relations first as they might reference columns/tables
            await tx.relation.deleteMany({ where: { projectId: id } });
            await tx.table.deleteMany({ where: { projectId: id } });

            // 3. Recreate Tables & Columns
            if (tables && Array.isArray(tables)) {
                // Use Promise.all for parallelism to speed up transaction
                await Promise.all(tables.map((table: any) =>
                    tx.table.create({
                        data: {
                            id: table.id,
                            name: table.name,
                            x: table.position?.x ?? table.x ?? 0,
                            y: table.position?.y ?? table.y ?? 0,
                            projectId: id,
                            columns: {
                                create: table.columns.map((col: any) => ({
                                    id: col.id,
                                    name: col.name,
                                    type: col.type,
                                    isPrimaryKey: col.isPrimaryKey,
                                    isNullable: col.isNullable,
                                })),
                            },
                        },
                    })
                ));
            }

            // 4. Recreate Relations
            if (relations && Array.isArray(relations) && relations.length > 0) {
                // Use createMany for better performance
                await tx.relation.createMany({
                    data: relations.map((rel: any) => ({
                        id: rel.id,
                        type: rel.type,
                        projectId: id,
                        sourceTableId: rel.sourceTableId,
                        sourceColumnId: rel.sourceColumnId,
                        targetTableId: rel.targetTableId,
                        targetColumnId: rel.targetColumnId,
                    }))
                });
            }

            return updatedProject;
        }, {
            maxWait: 5000,
            timeout: 20000, // Increase timeout to 20s to avoid P2028
        });

        const formattedProject = {
            ...result,
            createdAt: result.createdAt.toISOString(),
            lastEdited: result.lastEdited.toISOString(),
        };

        return NextResponse.json(formattedProject);
    } catch (error) {
        console.error('[PROJECT_PUT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    props: Props
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await props.params;

    try {
        await prisma.project.delete({
            where: {
                id,
                userId: session.user.id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[PROJECT_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
