import React from 'react';
import Navbar from '@/components/Navbar';

export default function BlogPage() {
    const posts = [
        {
            title: "Introducing SchemaStudio 1.0",
            excerpt: "We're excited to announce the public release of SchemaStudio, the fastest way to design databases.",
            date: "Feb 12, 2026",
            readTime: "5 min read",
            category: "Product"
        },
        {
            title: "Why we chose SQLite for local development",
            excerpt: "A deep dive into our decision to prioritize SQLite support and how it benefits developers.",
            date: "Feb 08, 2026",
            readTime: "8 min read",
            category: "Engineering"
        },
        {
            title: "Collaborative Database Design Patterns",
            excerpt: "Best practices for teams working on complex schemas together in real-time.",
            date: "Jan 25, 2026",
            readTime: "6 min read",
            category: "Guides"
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-32">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Blog</h1>
                <p className="text-lg text-zinc-400 mb-16 max-w-2xl">
                    Thoughts on database design, engineering, and the future of SchemaStudio.
                </p>

                <div className="space-y-12">
                    {posts.map((post, i) => (
                        <article key={i} className="group cursor-pointer border-b border-zinc-900 pb-12 hover:border-zinc-800 transition-colors">
                            <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3 font-mono">
                                <span className="text-blue-400 font-medium">{post.category}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {post.excerpt}
                            </p>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
