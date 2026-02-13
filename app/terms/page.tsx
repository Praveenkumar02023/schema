import React from 'react';
import Navbar from '@/components/Navbar';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-32">
                <h1 className="text-4xl font-bold mb-8 tracking-tight">Terms of Service</h1>

                <div className="prose prose-invert prose-blue max-w-none text-zinc-400">
                    <p className="lead text-lg text-zinc-300">
                        By using SchemaStudio, you agree to these terms.
                    </p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using SchemaStudio, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                    </p>

                    <h3>2. User Accounts</h3>
                    <p>
                        You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
                    </p>

                    <h3>3. Intellectual Property</h3>
                    <p>
                        The service and its original content, features, and functionality are and will remain the exclusive property of SchemaStudio and its licensors. The schemas you create belong to you.
                    </p>

                    <h3>4. Termination</h3>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        In no event shall SchemaStudio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
                    </p>
                </div>
            </main>
        </div>
    );
}
