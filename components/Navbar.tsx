'use client';

import Link from 'next/link';
import { Database, Github, ChevronDown, Rocket } from 'lucide-react';
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
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Database size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        DrawDB
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#examples" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Examples
                    </Link>
                    <Link href="/editor" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        App Editor
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Pricing
                    </Link>
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Resources
                            <ChevronDown size={14} />
                        </button>
                        {/* Dropdown would go here */}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
                    >
                        <Github size={14} />
                        <span>GitHub</span>
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
