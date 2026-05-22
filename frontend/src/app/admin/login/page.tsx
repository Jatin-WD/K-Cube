import AuthExperience from '@/components/AuthExperience';

export const metadata = {
  title: 'Admin Login | K-CUBE CMS',
  description: 'Admin login for K-CUBE CMS.',
};

const AdminLoginPage = () => {
  return <AuthExperience mode="admin" />;
};

export default AdminLoginPage;
