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
  curatedCategories: Category[];
  otherCategories: Category[];
}

export default function HeaderClient({ blogName, curatedCategories, otherCategories }: HeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

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

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            {blogName}
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <Link href="/" className={pathname === '/' ? styles.navLinkActive : styles.navLink}>
              Newsroom
            </Link>

            {/* Curated Categories with Dropdowns */}
            {curatedCategories.map((category) => (
              <div
                key={category.slug}
                className={styles.navItem}
                onMouseEnter={() => setActiveDropdown(category.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className={pathname === `/category/${category.slug}` ? styles.navLinkActive : styles.navLink}
                >
                  {category.name}
                </Link>

                {/* Dropdown for children */}
                {category.children && category.children.length > 0 && (
                  <div className={`${styles.dropdown} ${activeDropdown === category.slug ? styles.dropdownActive : ''}`}>
                    {category.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/category/${child.slug}`}
                        className={styles.dropdownLink}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Other Categories Dropdown */}
            {otherCategories.length > 0 && (
              <div
                className={styles.navItem}
                onMouseEnter={() => setActiveDropdown('other')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span className={styles.navLink}>
                  Other
                </span>
                <div className={`${styles.dropdown} ${activeDropdown === 'other' ? styles.dropdownActive : ''}`}>
                  {otherCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className={styles.dropdownLink}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link href="/search" className={styles.searchIcon} aria-label="Search">
              <svg width="16" height="44" viewBox="0 0 16 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M15.504 25.696L11.856 22.048C12.432 21.184 12.768 20.144 12.768 19.024C12.768 15.744 10.112 13.088 6.832 13.088C3.552 13.088 0.896 15.744 0.896 19.024C0.896 22.304 3.552 24.96 6.832 24.96C7.952 24.96 8.992 24.624 9.856 24.048L13.504 27.696C13.792 27.984 14.176 28.128 14.56 28.128C14.944 28.128 15.328 27.984 15.616 27.696C16.192 27.12 16.192 26.272 15.504 25.696ZM6.832 22.96C4.656 22.96 2.896 21.2 2.896 19.024C2.896 16.848 4.656 15.088 6.832 15.088C9.008 15.088 10.768 16.848 10.768 19.024C10.768 21.2 9.008 22.96 6.832 22.96Z" fill="currentColor"/>
              </svg>
            </Link>
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <nav className={styles.mobileNav}>
            <Link href="/" className={styles.mobileNavLink}>
              Newsroom
            </Link>
            {curatedCategories.map((category) => (
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
            {otherCategories.length > 0 && (
              <div>
                <span className={styles.mobileNavLink}>Other</span>
                <div className={styles.mobileSubMenu}>
                  {otherCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className={styles.mobileSubLink}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link href="/search" className={styles.mobileNavLink}>
              Search
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
