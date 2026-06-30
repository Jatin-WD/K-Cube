import { Suspense } from 'react';
import AuthExperience from '@/components/AuthExperience';

export const metadata = {
  title: 'Admin Login | K-CUBE CMS',
  description: 'Admin login for K-CUBE CMS.',
};

const AdminLoginPage = () => {
  return (
    <Suspense fallback={null}>
      <AuthExperience mode="admin" />
    </Suspense>
  );
};

export default AdminLoginPage;
