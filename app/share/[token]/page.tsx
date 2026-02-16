
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function JoinPage() {
    const params = useParams();
    const token = params?.token as string;
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError("No token provided");
            return;
        }

        const joinProject = async () => {
            try {
                // We don't have the project ID here, so we need an API that can find project by token globally
                // OR we encode projectId in the URL? 
                // Better Design: The share link should initiate a join request.
                // CURRENT HACK/PLAN REVISION:
                // Since our `join` route is at /api/projects/[id]/join, we need the ID.
                // But the share link is just a token. 
                // Let's create a global join API: /api/join-by-token

                const res = await fetch('/api/join', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                if (res.ok) {
                    const data = await res.json();
                    router.push(`/editor/${data.projectId}`);
                } else {
                    const msg = await res.text();
                    setError(msg || "Failed to join project");
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong");
            }
        };

        joinProject();
    }, [token, router]);

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-red-500 text-lg font-semibold">Error Joining Project</p>
                    <p className="text-zinc-400">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition-colors text-sm"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-zinc-400">Joining project...</p>
            </div>
        </div>
    );
}
