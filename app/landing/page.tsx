'use client';

import { Database, Zap, Users, Shield, ArrowRight, Star, Check } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 backdrop-blur-sm rounded-full border border-zinc-700/50 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Zap size={16} className="text-blue-400" />
            <span className="text-sm text-zinc-300">Visual Database Design Made Simple</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-8 duration-1000">
            Design Schemas
            <br />
            <span className="text-blue-400">Visually</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Create, visualize, and manage your database schemas with an intuitive drag-and-drop interface. 
            Perfect for developers, architects, and teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link 
              href="/"
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
            >
              Start Designing
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-24 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <div>
              <div className="text-4xl font-bold text-blue-400">10K+</div>
              <div className="text-sm text-zinc-500 mt-1">Schemas Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400">50K+</div>
              <div className="text-sm text-zinc-500 mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400">99.9%</div>
              <div className="text-sm text-zinc-500 mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-zinc-400">Everything you need to design perfect database schemas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Database size={24} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold">Visual Schema Builder</h3>
              </div>
              <p className="text-zinc-400 mb-8 text-lg">
                Drag, drop, and connect tables with an intuitive interface. See your database structure come to life in real-time.
              </p>
              <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-700/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-16 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center">
                    <Database size={20} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                  <div className="w-24 h-16 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center">
                    <Database size={20} className="text-zinc-500" />
                  </div>
                </div>
                <div className="text-xs text-zinc-500">Real-time relationship visualization</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300">
              <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
                <Zap size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-zinc-400">
                Optimized performance with GPU-accelerated rendering for smooth interactions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300">
              <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4">
                <Users size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
              <p className="text-zinc-400">
                Work together in real-time with your team on complex database designs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Shield size={24} className="text-amber-400" />
                </div>
                <h3 className="text-xl font-bold">Enterprise Security</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                Bank-level encryption and security standards to keep your schemas safe.
              </p>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-zinc-950/50 rounded-lg border border-zinc-700/30 text-sm">
                  <Check size={16} className="inline mr-2 text-green-400" />
                  End-to-end encryption
                </div>
                <div className="px-4 py-2 bg-zinc-950/50 rounded-lg border border-zinc-700/30 text-sm">
                  <Check size={16} className="inline mr-2 text-green-400" />
                  SOC 2 Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-xl text-zinc-400">See what our users have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Senior Database Architect",
                company: "TechCorp",
                review: "This tool has revolutionized how we design our database schemas. The visual interface is intuitive and the collaboration features are top-notch.",
                rating: 5
              },
              {
                name: "Michael Rodriguez",
                role: "Full Stack Developer",
                company: "StartupXYZ",
                review: "I've tried many schema designers, but this one stands out. The crow's foot notation is perfect and the export options are exactly what I needed.",
                rating: 5
              },
              {
                name: "Emily Watson",
                role: "CTO",
                company: "DataFlow Inc",
                review: "Our entire team switched to this platform. The real-time collaboration and clean interface make database design actually enjoyable.",
                rating: 5
              }
            ].map((review, i) => (
              <div key={i} className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 italic">"{review.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-zinc-500">{review.role} at {review.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of developers designing better databases
              </p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Start Designing for Free
                <ArrowRight size={20} />
              </Link>
              <p className="text-sm text-blue-100 mt-4">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database size={24} className="text-blue-400" />
                <span className="text-xl font-bold">SchemaFlow</span>
              </div>
              <p className="text-zinc-500 text-sm">
                Visual database design made simple and beautiful.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 SchemaFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
