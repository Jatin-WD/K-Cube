import AuthExperience from '@/components/AuthExperience';

interface SignInPageProps {
  searchParams?: {
    returnTo?: string;
    verified?: string;
    email?: string;
  };
}

const SignInPage = ({ searchParams }: SignInPageProps) => {
  return (
    <AuthExperience
      mode="signin"
      returnTo={searchParams?.returnTo ?? null}
      verified={searchParams?.verified ?? null}
      verifiedEmail={searchParams?.email ?? null}
    />
  );
};

export default SignInPage;
