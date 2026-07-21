import AuthForm from '@/components/auth-form';

export default async function Home({ searchParams }: { searchParams: { mode: string } }) {
  const { mode } = await searchParams;
  const formMode = mode || 'login';
  return <AuthForm mode={formMode} />;
}