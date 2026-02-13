import React from 'react';
import Navbar from '@/components/Navbar';

export default function ChangelogPage() {
    const changes = [
        {
            version: "v1.0.0",
            date: "February 12, 2026",
            title: "Public Release",
            items: [
                "Initial public launch of SchemaStudio.",
                "Support for visual schema design with drag-and-drop.",
                "Export to SQL for PostgreSQL, MySQL, and SQLite.",
                "Real-time collaboration for Team plans.",
                "Dark mode interface."
            ]
        },
        {
            version: "v0.9.0",
            date: "January 15, 2026",
            title: "Beta Features",
            items: [
                "Added support for foreign key constraints visualization.",
                "Improved canvas performance for large schemas.",
                "New 'Zen Mode' for distraction-free editing."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-32">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Changelog</h1>
                <p className="text-zinc-400 mb-16">
                    New updates and improvements to SchemaStudio.
                </p>

                <div className="relative border-l border-zinc-800 ml-4 space-y-16">
                    {changes.map((change, i) => (
                        <div key={i} className="relative pl-12">
                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500 border-4 border-zinc-950" />

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-medium border border-blue-500/20 w-fit">
                                    {change.version}
                                </span>
                                <span className="text-zinc-500 text-sm">{change.date}</span>
                            </div>

                            <h2 className="text-2xl font-bold text-zinc-100 mb-4">{change.title}</h2>

                            <ul className="space-y-2 text-zinc-400 list-disc pl-5 marker:text-zinc-600">
                                {change.items.map((item, j) => (
                                    <li key={j}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
