import AuthExperience from '@/components/AuthExperience';

interface SignUpPageProps {
  searchParams?: Promise<{
    returnTo?: string;
    ref?: string;
    referral?: string;
    referral_code?: string;
    verified?: string;
    email?: string;
  }>;
}

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const params = await searchParams;
  const referralParam = params?.ref ?? params?.referral ?? params?.referral_code ?? null;

  return (
    <AuthExperience
      mode="signup"
      returnTo={params?.returnTo ?? null}
      verified={params?.verified ?? null}
      verifiedEmail={params?.email ?? null}
      referralParam={referralParam}
    />
  );
};

export default SignUpPage;
