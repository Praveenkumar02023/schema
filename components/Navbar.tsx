'use client';

import Link from 'next/link';
import { Github, ChevronDown, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                        <span className="text-white">Schema</span><span className="text-blue-500">Studio</span>
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Pricing
                    </Link>
                    <Link href="/docs" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Docs
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/Praveenkumar02023/schema"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-sm font-medium text-zinc-300 transition-colors"
                    >
                        <Github size={16} />
                        <span>Star on GitHub</span>
                    </a>
                    <Link
                        href="/signin"
                        className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Go to App
                    </Link>
                </div>
            </div>
        </nav>
    );
}
