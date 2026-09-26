"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function HomeLanding() {
	const router = useRouter();

	// useEffect(() => {
	// 	const id = setTimeout(() => {
	// 		router.push("/login");
	// 	}, 3000);
	// 	return () => clearTimeout(id);
	// }, [router]);

	return (
		<main className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center">
				<Button onClick={() => router.push("/login")} className="mb-4">
					Go to Login
				</Button>
				<h1 className="text-3xl font-bold text-gold">RiseBet Admin</h1>
				<p className="mt-3 text-gray-300">Redirecting to login in 3 seconds…</p>
			</div>
		</main>
	);
}
