'use client';

import { Database, Zap, Users, Shield, ArrowRight, Star, Check, MessageSquare, Lock, Quote, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { companies } from '@/components/CompanyLogos';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-zinc-950">

        {/* Modern Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />

        {/* Subtle Spotlights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-700">

              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm text-xs font-medium text-zinc-400 mb-8 w-fit shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                v1.0 is now live
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05] text-zinc-100">
                Design databases
                <br />
                <span className="text-zinc-500">
                  at warp speed.
                </span>
              </h1>

              <p className="text-lg text-zinc-400 mb-10 max-w-lg leading-relaxed">
                The most intuitive entity-relationship diagram editor.
                Visualize, collaborate, and export production-ready SQL without the friction.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/signin"
                  className="px-8 py-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold text-lg transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                >
                  Start drawing free
                  <ArrowRight size={18} />
                </Link>
                <button className="px-8 py-4 bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 rounded-xl font-medium text-lg transition-all duration-200 flex items-center justify-center group">
                  <div className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center mr-2 group-hover:border-zinc-500 bg-zinc-900">
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-zinc-400 border-b-[4px] border-b-transparent ml-0.5 group-hover:border-l-zinc-200 transition-colors" />
                  </div>
                  Watch demo
                </button>
              </div>

              <div className="flex items-center gap-6 text-zinc-500 text-sm font-medium border-t border-zinc-900 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500/80" />
                  Free for individuals
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500/80" />
                  No credit card
                </div>
              </div>
            </div>

            {/* Right Image - Technical & Sleek */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 group lg:perspective-[1000px]">

              {/* Backglow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-purple-500/5 blur-3xl rounded-3xl" />

              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-700 lg:rotate-y-[-5deg] lg:rotate-x-[5deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transform-style-3d">
                {/* Editor Header Simulation */}
                <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <Lock size={8} /> schema.drawdb
                  </div>
                  <div className="w-10" />
                </div>

                <Image
                  src="/hero-diagram.png"
                  alt="DrawDB Editor Interface"
                  width={800}
                  height={600}
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                  priority
                />

                {/* Floating Elements on top of image */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                  <div className="bg-zinc-900/90 backdrop-blur border border-zinc-700/50 p-3 rounded-lg shadow-xl animate-float-delayed">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                        <FileText size={12} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-300">Export SQL</div>
                        <div className="text-[8px] text-zinc-500">PostgreSQL, MySQL</div>
                      </div>
                    </div>
                    <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Redesigned */}
      <section className="py-10 border-b border-white/5 bg-zinc-950 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

            {/* Label */}
            <div className="shrink-0">
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                Powering next-gen teams
              </span>
            </div>

            {/* Divider (Hidden on mobile) */}
            <div className="hidden md:block w-px h-8 bg-zinc-800" />

            {/* Marquee Container */}
            <div className="relative flex-1 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex gap-12 items-center animate-marquee w-max">
                {/* Logo Item Component for Consistency */}
                {[...companies, ...companies].map((company, i) => (
                  <div key={i} className="flex items-center gap-2 group cursor-default">
                    <company.logo className="h-5 w-5 text-zinc-600 group-hover:text-zinc-200 transition-colors" />
                    <span className="text-lg font-bold text-zinc-600 group-hover:text-zinc-200 transition-colors">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* New Bento Grid Features */}
      <section className="py-24 px-6 bg-zinc-950" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-6">
              Packed with features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Database Schema Diagrams
            </h2>
            <p className="text-xl text-zinc-500">Ready to get started?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">

            {/* 1. AI Agent - Large Card (Span 2) - TECH HUD REDESIGN */}
            <div className="md:col-span-2 bg-zinc-950 rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 card-hover-glow group relative overflow-hidden flex flex-col justify-between h-full min-h-[320px]">
              {/* Tech Grid Background using CSS */}
              <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:32px_32px] animate-grid-move" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-8 h-full">
                {/* Left: Text Content */}
                <div className="max-w-sm pt-4">
                  <div className="bg-emerald-950/50 w-fit px-3 py-1 rounded border border-emerald-500/30 mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-blink" />
                    <span className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase">Agent Active</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">DrawDB Architect</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Transform natural language into production-ready database schemas. The agent understands relationships, indexes, and constraints.
                  </p>

                  {/* Command Input Simulation */}
                  <div className="mt-8 bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 font-mono text-sm flex items-center gap-3 shadow-xl backdrop-blur-sm">
                    <span className="text-emerald-500 font-bold">{'>'}</span>
                    <span className="text-zinc-300">
                      <span className="typing-cursor">create users and posts with relations...</span>
                      <span className="animate-blink inline-block w-2 h-4 bg-emerald-500 ml-1 align-middle" />
                    </span>
                  </div>
                </div>

                {/* Right: The Core Visual (HUD Style) */}
                <div className="flex-1 w-full h-full min-h-[220px] relative flex items-center justify-center">
                  {/* The Core */}
                  <div className="w-64 h-64 relative">
                    {/* Outer Ring - Rotating */}
                    <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-tech-spin border-dashed" />
                    <div className="absolute inset-4 border border-emerald-500/20 rounded-full animate-tech-spin-reverse" />

                    {/* Central Processor */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-emerald-950/30 border border-emerald-500/50 rounded-lg backdrop-blur-md flex items-center justify-center relative shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <div className="absolute inset-0 border border-emerald-400/20 rounded-lg scale-110" />
                        <Zap size={32} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                        {/* Scanning Line inside Core */}
                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse overflow-hidden rounded-lg">
                          <div className="w-full h-[200%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent absolute top-[-50%] animate-grid-move" />
                        </div>
                      </div>
                    </div>

                    {/* Orbiting Data Nodes */}
                    {/* Node 1 */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                      <div className="bg-zinc-900 border border-emerald-500/30 px-3 py-1 rounded text-[10px] font-mono text-emerald-300 shadow-lg flex flex-col items-center">
                        <span className="uppercase tracking-wider opacity-50">Table</span>
                        <span className="font-bold">USERS</span>
                        <div className="w-0.5 h-4 bg-emerald-500/30 absolute -bottom-4" />
                      </div>
                    </div>
                    {/* Node 2 */}
                    <div className="absolute bottom-4 right-0 translate-x-2">
                      <div className="bg-zinc-900 border border-emerald-500/30 px-3 py-1 rounded text-[10px] font-mono text-emerald-300 shadow-lg flex flex-col items-center">
                        <span className="uppercase tracking-wider opacity-50">Table</span>
                        <span className="font-bold">POSTS</span>
                        <div className="w-4 h-0.5 bg-emerald-500/30 absolute -left-4 top-1/2" />
                      </div>
                    </div>
                    {/* Node 3 */}
                    <div className="absolute bottom-4 left-0 -translate-x-2">
                      <div className="bg-zinc-900 border border-emerald-500/30 px-3 py-1 rounded text-[10px] font-mono text-emerald-300 shadow-lg flex flex-col items-center">
                        <span className="uppercase tracking-wider opacity-50">Table</span>
                        <span className="font-bold">COMMENTS</span>
                        <div className="w-4 h-0.5 bg-emerald-500/30 absolute -right-4 top-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Instant Import (Span 1) - DATA PORTAL REDESIGN */}
            <div className="bg-zinc-900/30 rounded-3xl p-8 border border-purple-500/20 hover:border-purple-500/50 hover:bg-zinc-900/50 card-hover-glow group overflow-hidden relative flex flex-col min-h-[320px]">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full" />

              <div className="mb-2 relative z-10">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 border border-purple-500/20">
                  <Database size={20} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-100">Instant Import</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Paste SQL, connect DBs.
                </p>
              </div>

              {/* The Portal Animation */}
              <div className="flex-1 relative flex items-center justify-center mt-4">

                {/* The Source: Floating SQL Card */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 animate-float-y">
                  <div className="w-20 bg-zinc-900 border border-zinc-700/50 rounded-lg p-2 shadow-2xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <div className="h-1.5 w-8 bg-purple-500/50 rounded mb-2" />
                    <div className="space-y-1">
                      <div className="h-0.5 w-full bg-zinc-700 rounded" />
                      <div className="h-0.5 w-full bg-zinc-700 rounded" />
                      <div className="h-0.5 w-2/3 bg-zinc-700 rounded" />
                    </div>
                    <div className="absolute -right-1 -top-1 bg-purple-500 text-white text-[8px] font-bold px-1 rounded">SQL</div>
                  </div>
                </div>

                {/* The Stream: Code Particles */}
                <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-12 overflow-hidden flex items-center">
                  <div className="flex gap-2 animate-data-stream opacity-50">
                    <span className="text-[8px] font-mono text-purple-400">SELECT</span>
                    <span className="text-[8px] font-mono text-zinc-500">*</span>
                    <span className="text-[8px] font-mono text-purple-400">FROM</span>
                    <span className="text-[8px] font-mono text-zinc-300">users</span>
                  </div>
                </div>

                {/* The Destination: Portal & DB */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Rotating Portal Ring */}
                    <div className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full animate-portal-spin" />
                    <div className="absolute inset-0 border border-purple-500/10 rounded-full blur-sm" />

                    {/* Central DB Icon */}
                    <div className="relative z-10 bg-zinc-950 border border-purple-500/50 p-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                      <Database size={24} className="text-purple-400" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Export SQL (Span 1) - COMPACT V2 */}
            <div className="bg-zinc-900/30 rounded-3xl p-6 border border-blue-500/20 hover:border-blue-500/50 hover:bg-zinc-900/50 card-hover-glow group relative flex flex-col h-full overflow-hidden">
              <div className="mb-2 relative z-10">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2 border border-blue-500/20 group-hover:rotate-6 transition-transform">
                  <span className="font-mono font-bold text-blue-400 text-sm">{'<>'}</span>
                </div>
                <h3 className="text-lg font-bold mb-1 text-zinc-100">Export SQL</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Production-ready DDL scripts.
                </p>
              </div>

              {/* The Printer Factory Animation - Reduced Height */}
              <div className="flex-1 w-full bg-zinc-950/80 rounded-xl border border-blue-500/10 relative overflow-hidden flex flex-col items-center pt-6 h-[140px] min-h-[140px]">

                {/* The Output Slot (Top UI) */}
                <div className="absolute top-0 inset-x-0 h-4 bg-zinc-900 border-b border-zinc-800 z-20 shadow-lg flex items-center justify-center">
                  <span className="text-[8px] font-mono text-zinc-600 tracking-widest uppercase">GENERATING OUTPUT</span>
                </div>

                {/* The Scanning Beam */}
                <div className="absolute top-4 inset-x-0 h-1 bg-blue-500/50 blur-sm z-20 animate-printer-beam" />
                <div className="absolute top-4 inset-x-0 h-px bg-blue-400 z-30" />

                {/* The Infinite Scrolling Code */}
                <div className="w-[90%] font-mono text-[10px] text-blue-300/80 leading-relaxed opacity-80 h-full relative">
                  <div className="animate-print-slide">
                    {/* Block 1 */}
                    <div className="pb-8">
                      <p><span className="text-purple-400">CREATE TABLE</span> users (</p>
                      <p className="pl-4">id <span className="text-yellow-400">UUID PK</span>,</p>
                      <p className="pl-4">email <span className="text-yellow-400">VARCHAR</span>,</p>
                      <p>);</p>
                    </div>
                    {/* Block 2 */}
                    <div className="pb-8">
                      <p><span className="text-purple-400">CREATE TABLE</span> posts (</p>
                      <p className="pl-4">id <span className="text-yellow-400">UUID PK</span>,</p>
                      <p className="pl-4">title <span className="text-yellow-400">TEXT</span>,</p>
                      <p>);</p>
                    </div>
                    {/* Block 3 */}
                    <div className="pb-8">
                      <p><span className="text-purple-400">CREATE TABLE</span> users (</p>
                      <p className="pl-4">id <span className="text-yellow-400">UUID PK</span>,</p>
                      <p className="pl-4">email <span className="text-yellow-400">VARCHAR</span>,</p>
                      <p>);</p>
                    </div>
                  </div>
                </div>

                {/* Success Badge */}
                <div className="absolute bottom-4 right-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-success-pop z-30 flex items-center gap-1">
                  <Check size={10} className="stroke-[4]" /> DONE
                </div>

                {/* Gradient Fade at bottom */}
                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
              </div>
            </div>

            {/* 4. Real time collaboration (Span 2) - COMPACT REDESIGN */}
            <div className="md:col-span-2 bg-zinc-900/30 rounded-3xl p-6 border border-pink-500/20 hover:border-pink-500/50 hover:bg-zinc-900/50 card-hover-glow group overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                  <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center mb-2 border border-pink-500/20">
                    <Users size={16} className="text-pink-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-zinc-100">Real-time Collaboration</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                    Work together instantly. See changes live.
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaborative Canvas Visual - Compact */}
              <div className="flex-1 w-full bg-zinc-950/30 rounded-xl border border-pink-500/10 relative overflow-hidden h-[220px] min-h-[220px]">
                {/* Background Grid */}
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Active Region Highlights */}
                {/* --- Schema Nodes --- */}
                {/* 1. USERS (Top Left) */}
                <div className="absolute top-[10%] left-[5%] p-4 bg-zinc-900 border border-zinc-700/80 rounded-lg shadow-xl z-10 w-52 transform transition-transform hover:scale-105">
                  <div className="flex items-center gap-3 mb-3 border-b border-zinc-800 pb-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-xs font-mono text-zinc-300 font-bold">USERS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-2/3 bg-zinc-800/50 rounded" />
                    <div className="h-2 w-3/4 bg-zinc-800/30 rounded" />
                  </div>
                </div>

                {/* 2. POSTS (Top Right - Aligned with Mike) */}
                <div className="absolute top-[15%] left-[65%] p-4 bg-zinc-900 border border-zinc-700/80 rounded-lg shadow-xl z-10 w-52 transform transition-transform hover:scale-105">
                  <div className="flex items-center gap-3 mb-3 border-b border-zinc-800 pb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-mono text-zinc-300 font-bold">POSTS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-2 w-1/2 bg-zinc-800/50 rounded" />
                    <div className="h-2 w-5/6 bg-zinc-800/30 rounded" />
                  </div>
                </div>

                {/* 3. COMMENTS (Bottom Center) */}
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 p-4 bg-zinc-900 border border-zinc-700/80 rounded-lg shadow-xl z-10 w-52 transform transition-transform hover:scale-105">
                  <div className="flex items-center gap-3 mb-3 border-b border-zinc-800 pb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-xs font-mono text-zinc-300 font-bold">COMMENTS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-1/2 bg-zinc-800/50 rounded" />
                  </div>
                </div>

                {/* Connecting Wires */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <line x1="20%" y1="20%" x2="65%" y2="25%" stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.2" />
                  <line x1="65%" y1="25%" x2="50%" y2="80%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.2" />
                  <line x1="50%" y1="80%" x2="20%" y2="20%" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.2" />
                </svg>

                {/* Active Cursors */}
                <div className="animate-cursor-sarah z-20 w-max pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 drop-shadow-xl filter drop-shadow-[0_2px_4px_rgba(236,72,153,0.3)] transform rotate-[-15deg]">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                  </svg>
                  <div className="px-2 py-1 bg-pink-500 text-[10px] text-white rounded-r-md rounded-bl-md ml-3 shadow-sm font-bold whitespace-nowrap">
                    Sarah
                  </div>
                </div>

                <div className="animate-cursor-mike z-20 w-max pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500 drop-shadow-xl filter drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)] transform rotate-[-15deg]">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                  </svg>
                  <div className="px-2 py-1 bg-blue-500 text-[10px] text-white rounded-r-md rounded-bl-md ml-3 shadow-sm font-bold whitespace-nowrap">
                    Mike
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Keep on Track (Span 1) - HOLOGRAPHIC VERSION CYCLE */}
            <div className="bg-zinc-900/30 rounded-3xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-zinc-900/50 card-hover-glow group flex flex-col relative overflow-hidden">
              <div className="mb-4 z-10">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 border border-cyan-500/20">
                  <Shield size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-100">Versioning</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Track every schema change seamlessly.
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center py-2 relative min-h-[160px]">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />

                {/* Version Box Container */}
                <div className="relative w-full max-w-[220px] h-[110px]">

                  {/* Card 1: v1.3.1 */}
                  <div className="absolute inset-0 animate-card-1 p-4 flex flex-col justify-between bg-zinc-900/90 border border-cyan-500/30 rounded-xl backdrop-blur-md shadow-lg">
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-mono text-cyan-600">COMMIT_82A</div>
                      <div className="px-1.5 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-400 font-bold">running</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white mb-1">v1.3.1</div>
                      <div className="text-xs text-zinc-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        Migrating Users
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-xl overflow-hidden">
                      <div className="h-full bg-cyan-400 animate-progress-1" />
                    </div>
                  </div>

                  {/* Card 2: v1.3.2 */}
                  <div className="absolute inset-0 animate-card-2 p-4 flex flex-col justify-between bg-zinc-900/90 border border-purple-500/30 rounded-xl backdrop-blur-md shadow-lg">
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-mono text-purple-600">COMMIT_93B</div>
                      <div className="px-1.5 py-0.5 rounded bg-purple-950 text-[10px] text-purple-400 font-bold">deploying</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white mb-1">v1.3.2</div>
                      <div className="text-xs text-zinc-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Updating Posts
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-xl overflow-hidden">
                      <div className="h-full bg-purple-400 animate-progress-2" />
                    </div>
                  </div>

                </div>

                {/* Connection Lines (Decoration) */}
                <div className="absolute -z-10 h-full w-[1px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent top-0" />
              </div>
            </div>

            {/* 6. Amazing Docs (Span 2) - CODE TO DOCS TRANSFORMATION */}
            <div className="md:col-span-2 bg-zinc-900/30 rounded-3xl p-8 border border-orange-500/20 hover:border-orange-500/50 hover:bg-zinc-900/50 card-hover-glow group flex flex-col lg:flex-row gap-8 items-center lg:items-start relative overflow-hidden">
              <div className="flex-1 z-10">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 border border-orange-500/20">
                  <Star size={20} className="text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-100">Live Documentation</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Your schema automatically transforms into beautiful, interactive documentation.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    SQL Source
                  </div>
                  <div className="h-px w-8 bg-zinc-800" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse delay-75" />
                    Live Docs
                  </div>
                </div>
              </div>

              {/* Transformation Windows */}
              <div className="w-full lg:w-3/5 h-64 relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">

                {/* 1. LAYER: Raw Code (Background - Fades Out) */}
                <div className="absolute inset-0 p-6 font-mono text-[10px] leading-relaxed text-zinc-400 animate-code-fade">
                  <div className="text-purple-400">CREATE TABLE</div> <span className="text-yellow-100">users</span> (
                  <div className="pl-4">
                    <span className="text-blue-300">id</span> UUID PRIMARY KEY,<br />
                    <span className="text-blue-300">email</span> VARCHAR(255) UNIQUE,<br />
                    <span className="text-blue-300">full_name</span> TEXT,<br />
                    <span className="text-blue-300">created_at</span> TIMESTAMP<br />
                  </div>
                  );
                  <br /><br />
                  <div className="text-zinc-600">-- User posts table</div>
                  <div className="text-purple-400">CREATE TABLE</div> <span className="text-yellow-100">posts</span> (
                  <div className="pl-4">
                    <span className="text-blue-300">id</span> UUID,<br />
                    <span className="text-blue-300">title</span> TEXT NOT NULL<br />
                  </div>
                  );
                </div>

                {/* 2. LAYER: Beautiful Docs (Foreground - Appears) */}
                <div className="absolute inset-0 p-6 flex flex-col justify-center animate-doc-appear pointer-events-none">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                      <Users size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Users Table</div>
                      <div className="text-[10px] text-zinc-400">Core system identity</div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-900/80 border border-zinc-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Lock size={10} className="text-yellow-500" />
                        <span className="text-xs font-mono text-zinc-300">id</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">UUID</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-zinc-900/80 border border-zinc-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={10} className="text-zinc-600" />
                        <span className="text-xs font-mono text-zinc-300">email</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">String</span>
                    </div>
                  </div>
                </div>

                {/* 3. LAYER: Scanning Beam Overlay */}
                <div className="absolute inset-x-0 h-[2px] bg-orange-500 shadow-[0_0_20px_#f97316] animate-scan-line z-20" />
                <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-orange-500/10 to-transparent animate-scan-line -translate-y-full z-10" />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section - Modern Marquee */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Loved by engineering teams
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Join thousands of developers who are designing systems faster and better.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="flex flex-col gap-8 marquee-mask relative z-0">

          {/* Row 1: Left Scroll */}
          <div className="flex gap-8 animate-marquee w-max hover:pause">
            {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (
              <ReviewCard key={`r1-${i}`} review={review} />
            ))}
          </div>


          {/* Row 2: Right Scroll */}
          <div className="flex gap-8 animate-marquee-reverse w-max hover:pause">
            {[...reviewsReverse, ...reviewsReverse, ...reviewsReverse, ...reviewsReverse].map((review, i) => (
              <ReviewCard key={`r2-${i}`} review={review} />
            ))}
          </div>

        </div>

        {/* Gradient Overlay Details */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
      </section>

      {/* Pricing Section - Redesigned */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Flexible pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Choose your plan
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include core features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">

            {/* Free Tier */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-zinc-300 mb-2">Free</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-bold text-white">$0</span>
                    <span className="text-zinc-500 text-sm font-medium">/month</span>
                  </div>
                  <p className="text-zinc-500 text-sm">Perfect for getting started</p>
                </div>

                <Link
                  href="/signin"
                  className="block w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-center transition-colors mb-8"
                >
                  Get started
                </Link>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">1 public project</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">Basic SQL export</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">Community support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">Up to 50 tables</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tier - Featured */}
            <div className="group relative md:-mt-4">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-2xl blur-2xl opacity-60" />

              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wide shadow-lg">
                  Most Popular
                </div>
              </div>

              <div className="relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-bold text-white">$12</span>
                    <span className="text-zinc-400 text-sm font-medium">/month</span>
                  </div>
                  <p className="text-zinc-400 text-sm">For professional developers</p>
                </div>

                <Link
                  href="/signin"
                  className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-center transition-all shadow-lg shadow-emerald-900/20 mb-8"
                >
                  Start free trial
                </Link>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-300 text-sm font-medium">Unlimited projects</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-300 text-sm font-medium">Real-time collaboration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-300 text-sm font-medium">Advanced SQL generation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-300 text-sm font-medium">Version history (30 days)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-300 text-sm font-medium">Priority support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Tier */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-zinc-300 mb-2">Team</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-bold text-white">$49</span>
                    <span className="text-zinc-500 text-sm font-medium">/month</span>
                  </div>
                  <p className="text-zinc-500 text-sm">For growing teams</p>
                </div>

                <button className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors mb-8">
                  Contact sales
                </button>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">SSO & SAML</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">Unlimited version history</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">Advanced permissions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-zinc-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 text-sm">Dedicated support</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom note */}
          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Modern FAQ Section */}
      <section className="py-32 relative bg-zinc-950">
        {/* Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-zinc-400">Everything you need to know about DrawDB.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is the generated SQL production-ready?", a: "Yes. The SQL exported is fully compliant with standard PostgreSQL, MySQL, and SQLite syntax. It includes proper constraints, indexes, and relationship definitions." },
              { q: "Can I collaborate with my team in real-time?", a: "Absolutely. Multi-user collaboration is built-in. You can see cursors, live edits, and leave comments on specific nodes just like in Figma." },
              { q: "Does it support importing existing schemas?", a: "Yes, you can upload a .sql file or connect directly to your database (Pro plan) to visualize and reverse-engineer your existing schema instantly." },
              { q: "Is there a free tier available?", a: "We offer a generous Free usage tier for individuals and small hobby projects. It includes unlimited public projects and up to 3 private projects." },
              { q: "How does the version control work?", a: "Every change is tracked as a 'commit'. You can branch, merge, and revert changes visually, giving you Git-like superpowers for your database design." }
            ].map((faq, i) => (
              <details key={i} className="group bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 open:bg-zinc-900/80 open:border-blue-500/30 open:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <summary className="flex items-center justify-between p-6 cursor-pointer text-zinc-200 font-medium select-none">
                  <span className="text-lg group-open:text-blue-400 transition-colors">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/50 group-open:bg-blue-500/10 group-open:border-blue-500/50 transition-all duration-300">
                    <svg className="w-5 h-5 text-zinc-400 transition-transform duration-300 group-open:rotate-180 group-open:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-zinc-800/30 pt-4 animate-content-reveal">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div >
  );
}

// Data & Components
const reviews = [
  {
    name: "Sarah Chen",
    role: "Sr. Architect",
    company: "TechCorp",
    text: "Finally, a schema tool that feels like a proper IDE. The collaborative features are game-changing for our distributed team.",
    stack: "PostgreSQL",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Alex Rivera",
    role: "CTO",
    company: "StartUp",
    text: "The real-time collaboration saves us hours every week. We went from whiteboards to DrawDB and never looked back.",
    stack: "MySQL",
    image: "https://i.pravatar.cc/150?u=alex"
  },
  {
    name: "Mike Ross",
    role: "Backend Lead",
    company: "DevInc",
    text: "Visualize, design, export. The workflow is flawless. It handles our complex 300+ table schema without breaking a sweat.",
    stack: "Supabase",
    image: "https://i.pravatar.cc/150?u=mike"
  },
  {
    name: "Emily Wang",
    role: "Product Mgr",
    company: "SoftSys",
    text: "It's like Figma but for databases. Absolutely love it. Bridging the gap between product and engineering has never been easier.",
    stack: "Prisma",
    image: "https://i.pravatar.cc/150?u=emily"
  },
  {
    name: "David Kim",
    role: "Engineer",
    company: "CloudNet",
    text: "Migration scripts are spot on. Zero errors in prod. The SQL generation capability is robust and reliable.",
    stack: "Drizzle",
    image: "https://i.pravatar.cc/150?img=12"
  },
];

const reviewsReverse = [...reviews].reverse();

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="w-[450px] p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group cursor-default relative overflow-hidden">

      {/* Subtle background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[2px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <Image
              src={review.image}
              alt={review.name}
              width={48}
              height={48}
              className="rounded-full border-2 border-zinc-800 group-hover:border-zinc-600 transition-colors relative z-10"
            />
          </div>
          <div>
            <h4 className="font-bold text-zinc-100 text-base">{review.name}</h4>
            <p className="text-xs text-zinc-500 font-medium">{review.role} @ {review.company}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400 group-hover:border-zinc-700 transition-colors">
            {review.stack}
          </div>
          <div className="flex gap-0.5 text-orange-500">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Star key={i} size={10} fill="currentColor" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-zinc-300 text-sm leading-relaxed font-normal">
          "{review.text}"
        </p>
      </div>

      {/* Verified Badge */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
          <CheckCircle2 size={12} className="text-emerald-500" />
          Verified User
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">2 days ago</span>
      </div>

    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top CTA Banner */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Ready to get started?</h2>
          <button className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 border-t border-zinc-900 pt-12">

          {/* Column 1: Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Database size={24} className="text-blue-500" />
              <span className="text-xl font-bold text-white">DrawDB</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Instantly visualize your database schema and generate ER diagrams.
            </p>

            {/* Social Icons */}
            <div className="flex gap-6 text-zinc-500">
              <a href="#" className="hover:text-white transition-colors"><TwitterIcon size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><GithubIcon size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><MessageSquare size={18} /></a>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 w-max">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-400">All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-6">
            <h4 className="font-bold text-white text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Download</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-6">
            <h4 className="font-bold text-white text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Guides</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-6">
            <h4 className="font-bold text-white text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="space-y-6">
            <h4 className="font-bold text-white text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cookies</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

// Simple Icons for footer
function TwitterIcon({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 12.5S1.2 2.9 8.3 9c2.5-3.6 8.5-4 8.5-4s-.4 2.2-2.1 4.5c2.6.4 7.3-7.5 7.3-7.5z" /></svg> }
function GithubIcon({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg> }
