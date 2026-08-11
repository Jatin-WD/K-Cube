import AuthExperience from '@/components/AuthExperience';

interface SignUpPageProps {
  searchParams?: {
    returnTo?: string;
    ref?: string;
    referral?: string;
    referral_code?: string;
    verified?: string;
    email?: string;
  };
}

const SignUpPage = ({ searchParams }: SignUpPageProps) => {
  const referralParam = searchParams?.ref ?? searchParams?.referral ?? searchParams?.referral_code ?? null;

  return (
    <AuthExperience
      mode="signup"
      returnTo={searchParams?.returnTo ?? null}
      verified={searchParams?.verified ?? null}
      verifiedEmail={searchParams?.email ?? null}
      referralParam={referralParam}
    />
  );
};

export default SignUpPage;
