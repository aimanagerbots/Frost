import { cookies } from 'next/headers';

export default async function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clear auth cookie so password is required on every visit/reload
  (await cookies()).delete('site-auth');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {children}
    </div>
  );
}
