'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.css';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

interface HeaderClientProps {
  blogName: string;
  menuCategories: Category[];
  otherCategories: Category[];
  currentCategory?: Category;
}

export default function HeaderClient({ blogName, menuCategories, otherCategories, currentCategory }: HeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('');
  const [submenu, setSubmenu] = useState<Category[] | null>(null);

  // Determine current page type and extract category info from URL
  useEffect(() => {
    setIsSearchPage(pathname === '/search' || pathname?.startsWith('/search?'));
    setIsDashboard(pathname === '/');
    setIsMobileMenuOpen(false);

    // Extract category slug from URL and find submenu
    if (pathname?.startsWith('/category/')) {
      const categorySlug = pathname.split('/')[2];
      const allCategories = [...menuCategories, ...otherCategories];
      
      const found = allCategories.find(cat => cat.slug === categorySlug);
      if (found) {
        setCurrentCategoryName(found.name);
        setSubmenu(found.children && found.children.length > 0 ? found.children : null);
      }
    } else {
      setCurrentCategoryName('');
      setSubmenu(null);
    }
  }, [pathname, menuCategories, otherCategories]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Get all root categories (menu + other)
  const allRootCategories = [...menuCategories, ...otherCategories];

  const showSubmenu = pathname?.startsWith('/category/') && !isDashboard && submenu && submenu.length > 0;

  return (
    <>
      {/* Top Bar - Dark Background with Root Categories */}
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            {blogName}
          </Link>

          {/* Desktop Navigation - Root Categories */}
          <nav className={styles.nav}>
            {/* All Topics link */}
            <Link
              href="/"
              className={pathname === '/' ? styles.navLinkActive : styles.navLink}
            >
              All Topics
            </Link>

            {/* Menu categories */}
            {menuCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={pathname === `/category/${category.slug}` ? styles.navLinkActive : styles.navLink}
              >
                {category.name}
              </Link>
            ))}

            {/* Other categories dropdown */}
            {otherCategories.length > 0 && (
              <div 
                className={styles.dropdownWrapper}
                onMouseEnter={() => setIsOtherMenuOpen(true)}
                onMouseLeave={() => setIsOtherMenuOpen(false)}
              >
                <span className={styles.navLink} style={{ display: 'inline-block' }}>
                  Other
                </span>
                {isOtherMenuOpen && (
                  <nav className={styles.dropdown}>
                    {otherCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className={styles.dropdownLink}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>
            )}

            {/* Search Icon - Only on non-search pages */}
            {!isSearchPage && (
              <Link href="/search" className={styles.searchIcon} aria-label="Search">
                <svg width="16" height="44" viewBox="0 0 16 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M15.504 25.696L11.856 22.048C12.432 21.184 12.768 20.144 12.768 19.024C12.768 15.744 10.112 13.088 6.832 13.088C3.552 13.088 0.896 15.744 0.896 19.024C0.896 22.304 3.552 24.96 6.832 24.96C7.952 24.96 8.992 24.624 9.856 24.048L13.504 27.696C13.792 27.984 14.176 28.128 14.56 28.128C14.944 28.128 15.328 27.984 15.616 27.696C16.192 27.12 16.192 26.272 15.504 25.696ZM6.832 22.96C4.656 22.96 2.896 21.2 2.896 19.024C2.896 16.848 4.656 15.088 6.832 15.088C9.008 15.088 10.768 16.848 10.768 19.024C10.768 21.2 9.008 22.96 6.832 22.96Z" fill="currentColor"/>
                </svg>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
             <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path d="M1.5 1.5L16.5 16.5M16.5 1.5L1.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                ) : (
                  <path d="M1.5 3.5H16.5M1.5 9H16.5M1.5 14.5H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                )}
             </svg>
          </button>
        </div>
      </header>

      {/* Newsroom Section - Light Background (Sticky) */}
      <div className={styles.newsroomSection}>
        <div className={styles.container}>
          {/* Left: Page Title */}
          <div className={styles.newsroomLeft}>
            <h2 className={styles.newsroomTitle}>
              {isDashboard ? 'Latest News' : currentCategoryName || 'Newsroom'}
            </h2>
          </div>

          {/* Right: Submenu + Search (only on category pages, not on dashboard/search) */}
          {showSubmenu && submenu && submenu.length > 0 && (
            <div className={styles.newsroomRight}>
              <nav className={styles.submenu}>
                {submenu.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/category/${item.slug}`}
                    className={pathname === `/category/${item.slug}` ? styles.submenuLinkActive : styles.submenuLink}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <nav className={styles.mobileNav}>
            <Link href="/" className={styles.mobileNavLink}>
              Newsroom
            </Link>
            {allRootCategories.map((category) => (
              <div key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className={styles.mobileNavLink}
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className={styles.mobileSubMenu}>
                    {category.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/category/${child.slug}`}
                        className={styles.mobileSubLink}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/portfolio" className={styles.mobileNavLink}>
              Portfolio
            </Link>
            <Link href="/search" className={styles.mobileNavLink}>
              Search
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
