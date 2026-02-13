import React from 'react';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
            <Navbar />
            <main className="max-w-xl mx-auto px-6 py-32">
                <h1 className="text-4xl font-bold mb-6 tracking-tight">Contact Us</h1>
                <p className="text-lg text-zinc-400 mb-12">
                    Have questions or feedback? We'd love to hear from you.
                </p>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
                        <select
                            id="subject"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option>General Inquiry</option>
                            <option>Support</option>
                            <option>Enterprise</option>
                            <option>Feedback</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                        <textarea
                            id="message"
                            rows={5}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="How can we help?"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Send Message
                    </button>
                </form>
            </main>
        </div>
    );
}
