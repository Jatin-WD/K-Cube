import { Suspense } from 'react';
import AuthExperience from '@/components/AuthExperience';

const SignInPage = () => {
  return (
    <Suspense fallback={null}>
      <AuthExperience mode="signin" />
    </Suspense>
  );
};

export default SignInPage;
