import AdminControlCenter from '@/components/AdminControlCenter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Community Map | K-CUBE Admin',
  description: 'Admin-only geographic analytics for the K-CUBE community.',
};

const CommunityMapPage = () => <AdminControlCenter initialSection="communityMap" />;

export default CommunityMapPage;
