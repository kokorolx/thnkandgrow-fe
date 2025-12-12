import { getApolloClient } from '@/lib/apollo';
import { GET_GENERAL_SETTINGS, GET_CATEGORIES } from '@/lib/queries';
import { getCachedData, isCacheValid } from '@/lib/cache';
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
  let blogName = 'Newsroom';
  let rawCategories: Category[] = [];

  // Try to use cache first
  const useCache = isCacheValid();
  if (useCache) {
    try {
      const cachedData = getCachedData();
      if (cachedData) {
        console.log('📦 Using cached GraphQL data for Header');
        blogName = cachedData.settings?.title || 'Newsroom';
        rawCategories = cachedData.categories || [];
      } else {
        throw new Error('Cache data is null');
      }
    } catch (error) {
      console.warn('⚠️ Failed to use cache, falling back to GraphQL:', error);
      // Fall through to GraphQL fetch
    }
  }

  // If cache is not used or failed, fetch from GraphQL
  if (!useCache || !blogName || rawCategories.length === 0) {
    try {
      console.log('🔄 Fetching from GraphQL API');
      const client = getApolloClient();
      const [settingsData, categoriesData] = await Promise.all([
        client.query({ query: GET_GENERAL_SETTINGS }),
        client.query({ query: GET_CATEGORIES }),
      ]);

      blogName = (settingsData.data as any)?.generalSettings?.title || 'Newsroom';
      rawCategories = (categoriesData.data as any)?.categories?.nodes || [];
    } catch (error) {
      console.error('❌ Failed to fetch from GraphQL:', error);
      // Use fallback values
      blogName = 'Newsroom';
      rawCategories = [];
    }
  }

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

  // Define fixed menu structure in order
  const menuOrder = [
    'architecture-and-design',
    'database',
    'ruby-on-rails',
    'nodejs',
    'tips'
  ];

  // Organize categories into menu items
  const menuCategories = menuOrder
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

  // Get all other categories (not in menu list and not children of menu categories)
  const menuIds = new Set(menuCategories.map(cat => cat!.id));
  const menuChildrenIds = new Set(
    menuCategories.flatMap(cat => cat!.children.map(child => child.id))
  );

  const otherCategories = Array.from(categoryMap.values())
    .filter(cat => !cat.parentId && !menuIds.has(cat.id) && !menuChildrenIds.has(cat.id))
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      children: cat.children,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // This component is server-side, so we pass categories to client
  // currentCategory will be determined client-side based on pathname
  return <HeaderClient
    blogName={blogName}
    menuCategories={menuCategories as any}
    otherCategories={otherCategories}
  />;
}
