'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
                <Image src="/icons/search.svg" alt="Search" width={16} height={44} />
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
             <Image 
               src={isMobileMenuOpen ? "/icons/close.svg" : "/icons/menu.svg"} 
               alt={isMobileMenuOpen ? "Close menu" : "Open menu"} 
               width={18} 
               height={18} 
             />
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
