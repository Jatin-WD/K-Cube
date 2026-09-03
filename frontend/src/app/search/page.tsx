import SearchResults from '@/components/SearchResults';

interface SearchPageProps {
  searchParams?: Promise<{ q?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  return <SearchResults query={params?.q || ''} />;
};

export const metadata = {
  title: 'Search | K-CUBE',
  description: 'Search K-CUBE activities, Korean learning, K-Food, events and rewards.',
};

export default SearchPage;
