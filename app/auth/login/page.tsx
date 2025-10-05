'use client';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auths/loginform';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="w-full h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={() => router.push('/home')} />
      </div>
    </div>
  );
}
