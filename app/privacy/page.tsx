import React from 'react';
import Navbar from '@/components/Navbar';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-32">
                <h1 className="text-4xl font-bold mb-8 tracking-tight">Privacy Policy</h1>

                <div className="prose prose-invert prose-blue max-w-none text-zinc-400">
                    <p className="lead text-lg text-zinc-300">
                        Last updated: February 12, 2026. Your privacy is critically important to us.
                    </p>

                    <h3>1. Information We Collect</h3>
                    <p>
                        When you sign up for SchemaStudio, we collect personal information such as your name, email address, and authentication details from providers like Google or GitHub. We also store the database schemas you create.
                    </p>

                    <h3>2. How We Use Information</h3>
                    <p>
                        We use your information to:
                        <ul>
                            <li>Provide and maintain the SchemaStudio service.</li>
                            <li>Improve and personalize your experience.</li>
                            <li>Communicate with you about updates and support.</li>
                        </ul>
                    </p>

                    <h3>3. Data Security</h3>
                    <p>
                        We implement industry-standard encryption and security measures to protect your data. Your schemas are stored in secure databases with strict access controls.
                    </p>

                    <h3>4. Third-Party Services</h3>
                    <p>
                        We may use third-party services for analytics, payment processing, and hosting. These services adhere to their own privacy policies.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@schema.studio.
                    </p>
                </div>
            </main>
        </div>
    );
}
