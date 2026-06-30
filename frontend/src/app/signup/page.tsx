import { Suspense } from 'react';
import AuthExperience from '@/components/AuthExperience';

const SignUpPage = () => {
  return (
    <Suspense fallback={null}>
      <AuthExperience mode="signup" />
    </Suspense>
  );
};

export default SignUpPage;
