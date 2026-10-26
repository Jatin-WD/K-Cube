import AuthExperience from '@/components/AuthExperience';

interface SignInPageProps {
  searchParams?: Promise<{
    returnTo?: string;
    verified?: string;
    email?: string;
  }>;
}

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const params = await searchParams;
  return (
    <AuthExperience
      mode="signin"
      returnTo={params?.returnTo ?? null}
      verified={params?.verified ?? null}
      verifiedEmail={params?.email ?? null}
    />
  );
};

export default SignInPage;
