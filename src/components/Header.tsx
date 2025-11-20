import { getApolloClient } from '@/lib/apollo';
import { GET_GENERAL_SETTINGS, GET_CATEGORIES } from '@/lib/queries';
import HeaderClient from './HeaderClient';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  parentId: string | null;
  parent?: {
    node: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export default async function Header() {
  const client = getApolloClient();

  // Fetch data server-side
  const [settingsData, categoriesData] = await Promise.all([
    client.query({ query: GET_GENERAL_SETTINGS }),
    client.query({ query: GET_CATEGORIES }),
  ]);

  const blogName = (settingsData.data as any)?.generalSettings?.title || 'Newsroom';
  const rawCategories: Category[] = (categoriesData.data as any)?.categories?.nodes || [];

  // Build hierarchical structure
  const categoryMap = new Map<string, Category & { children: Category[] }>();

  // First pass: create map of all categories
  rawCategories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Second pass: build parent-child relationships
  rawCategories.forEach(cat => {
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId);
      const child = categoryMap.get(cat.id);
      if (parent && child) {
        parent.children.push(child);
      }
    }
  });

  // Define curated menu structure
  const curatedMenuSlugs = [
    'architecture-design-system-security',
    'database',
    'nodejs',
    'ruby-rails',
    'tips'
  ];

  // Organize categories into curated menu
  const curatedCategories = curatedMenuSlugs
    .map(slug => {
      const category = Array.from(categoryMap.values()).find(cat => cat.slug === slug);
      return category ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        children: category.children,
      } : null;
    })
    .filter(Boolean);

  // Get all other categories (not in curated list and not children of curated categories)
  const curatedIds = new Set(curatedCategories.map(cat => cat!.id));
  const curatedChildrenIds = new Set(
    curatedCategories.flatMap(cat => cat!.children.map(child => child.id))
  );

  const otherCategories = Array.from(categoryMap.values())
    .filter(cat => !cat.parentId && !curatedIds.has(cat.id) && !curatedChildrenIds.has(cat.id))
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      children: cat.children,
    }));

  return <HeaderClient
    blogName={blogName}
    curatedCategories={curatedCategories as any}
    otherCategories={otherCategories}
  />;
}
