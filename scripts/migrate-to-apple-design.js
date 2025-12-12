#!/usr/bin/env node

/**
 * Apple Design System Migration Script
 * 
 * This script analyzes the current codebase and reports:
 * 1. Components using non-compliant spacing values
 * 2. Typography inconsistencies
 * 3. Color palette deviations
 * 4. Border radius violations
 * 5. Shadow system misalignments
 * 
 * Usage: node scripts/migrate-to-apple-design.js [--fix]
 */

const fs = require('fs');
const path = require('path');

// Design system constants from Apple's extracted data
const APPLE_DESIGN_SYSTEM = {
  colors: {
    primary: {
      dark: '#1d1d1f',
      black: '#000000',
      white: '#ffffff',
      light: '#f5f5f7',
    },
    secondary: {
      light: '#e8e8ed',
      gray: '#6e6e73',
    },
    accent: {
      blue: '#0066cc',
      blueLight: '#0071e3',
    },
  },
  typography: {
    display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    text: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    sizes: {
      h1Large: '2.13rem', // 34px
      h1Display: '2rem', // 32px
      h1Medium: '1.59rem', // 25.5px
      h1Small: '1.5rem', // 24px
      h2: '1.31rem', // 21px
      buttonLarge: '1.75rem', // 28px
      buttonNormal: '1.13rem', // 18px
      body: '1rem', // 16px
      small: '0.875rem', // 14px
      caption: '0.75rem', // 12px
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '64px',
  },
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.18)',
    focus: '0 0 0 2px #0071e3',
  },
};

class AppleDesignMigration {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  /**
   * Scan CSS files for design system violations
   */
  scanCSSFiles(dirPath = 'src') {
    console.log('🔍 Scanning CSS files...\n');
    
    const files = this.findFiles(dirPath, /\.css$/);
    
    files.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8');
      this.analyzeCSSContent(content, filePath);
    });
  }

  /**
   * Find all files matching pattern in directory
   */
  findFiles(dirPath, pattern) {
    const files = [];
    
    const traverse = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
          traverse(fullPath);
        } else if (entry.isFile() && pattern.test(entry.name)) {
          files.push(fullPath);
        }
      });
    };
    
    traverse(dirPath);
    return files;
  }

  /**
   * Analyze CSS content for violations
   */
  analyzeCSSContent(content, filePath) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check for hardcoded spacing values outside Apple's scale
      const spacingMatch = line.match(/(padding|margin|gap|width|height|top|right|bottom|left)\s*:\s*([^;]+)/);
      if (spacingMatch) {
        const value = spacingMatch[2].trim();
        if (!this.isValidSpacing(value)) {
          this.issues.push({
            type: 'spacing',
            severity: 'warning',
            file: filePath,
            line: index + 1,
            value,
            message: `Non-compliant spacing value: ${value}. Use: ${Object.values(APPLE_DESIGN_SYSTEM.spacing).join(', ')}`,
          });
        }
      }

      // Check for non-Apple fonts
      if (line.includes('font-family') && !line.includes('var(') && !line.includes('SF Pro')) {
        this.issues.push({
          type: 'typography',
          severity: 'warning',
          file: filePath,
          line: index + 1,
          message: 'Font should use SF Pro Display or SF Pro Text (or CSS variables)',
        });
      }

      // Check for hardcoded colors outside palette
      const colorMatch = line.match(/(color|background-color|border-color)\s*:\s*([^;]+)/);
      if (colorMatch && !colorMatch[2].includes('var(')) {
        const color = colorMatch[2].trim();
        if (!this.isValidColor(color)) {
          this.issues.push({
            type: 'color',
            severity: 'info',
            file: filePath,
            line: index + 1,
            value: color,
            message: `Consider using CSS variable: var(--color-...) instead of hardcoded ${color}`,
          });
        }
      }

      // Check for non-Apple border radius
      const radiusMatch = line.match(/border-radius\s*:\s*([^;]+)/);
      if (radiusMatch && !radiusMatch[1].includes('var(')) {
        const radius = radiusMatch[1].trim();
        if (!this.isValidBorderRadius(radius)) {
          this.issues.push({
            type: 'borderRadius',
            severity: 'warning',
            file: filePath,
            line: index + 1,
            value: radius,
            message: `Non-compliant border-radius: ${radius}. Use: ${Object.values(APPLE_DESIGN_SYSTEM.borderRadius).join(', ')}`,
          });
        }
      }

      // Check for shadows
      const shadowMatch = line.match(/box-shadow\s*:\s*([^;]+)/);
      if (shadowMatch && !shadowMatch[1].includes('var(')) {
        const shadow = shadowMatch[1].trim();
        if (shadow !== 'none' && !this.isValidShadow(shadow)) {
          this.issues.push({
            type: 'shadow',
            severity: 'info',
            file: filePath,
            line: index + 1,
            value: shadow,
            message: `Consider using shadow variables: ${Object.keys(APPLE_DESIGN_SYSTEM.shadows).map(k => `var(--shadow-${k})`).join(', ')}`,
          });
        }
      }
    });
  }

  /**
   * Validate spacing value against Apple's scale
   */
  isValidSpacing(value) {
    if (value.includes('var(')) return true;
    if (value.includes('auto') || value.includes('%') || value.includes('calc(')) return true;
    
    const validValues = Object.values(APPLE_DESIGN_SYSTEM.spacing);
    return validValues.includes(value) || value === '0';
  }

  /**
   * Validate color is in Apple's palette
   */
  isValidColor(value) {
    if (value.includes('var(')) return true;
    if (value.includes('transparent') || value === 'inherit') return true;
    
    const flatColors = Object.values(APPLE_DESIGN_SYSTEM.colors)
      .flatMap(v => Object.values(v));
    
    return flatColors.includes(value.toLowerCase());
  }

  /**
   * Validate border radius
   */
  isValidBorderRadius(value) {
    if (value.includes('var(')) return true;
    
    const validValues = Object.values(APPLE_DESIGN_SYSTEM.borderRadius);
    return validValues.includes(value);
  }

  /**
   * Validate shadow
   */
  isValidShadow(value) {
    if (value.includes('var(')) return true;
    
    const validValues = Object.values(APPLE_DESIGN_SYSTEM.shadows);
    return validValues.some(v => value.includes(v));
  }

  /**
   * Print report
   */
  printReport() {
    const grouped = {};
    
    this.issues.forEach(issue => {
      const key = issue.type;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(issue);
    });

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 APPLE DESIGN SYSTEM AUDIT REPORT');
    console.log('═══════════════════════════════════════════════════════\n');

    let totalIssues = 0;

    Object.entries(grouped).forEach(([type, issues]) => {
      console.log(`\n${this.getIcon(type)} ${type.toUpperCase()} (${issues.length} issues)`);
      console.log('─'.repeat(50));
      
      issues.slice(0, 5).forEach(issue => {
        console.log(`  ${issue.file.replace(process.cwd(), '.')}:${issue.line}`);
        console.log(`    ${issue.message}\n`);
      });

      if (issues.length > 5) {
        console.log(`  ... and ${issues.length - 5} more\n`);
      }

      totalIssues += issues.length;
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n📈 Summary: ${totalIssues} total issues found`);
    console.log('\nRecommendations:');
    console.log('  ✓ Use CSS variables from src/styles/apple-design-system.css');
    console.log('  ✓ Replace hardcoded values with var(--color-*), var(--spacing-*), etc');
    console.log('  ✓ Update fonts to SF Pro Display or SF Pro Text');
    console.log('  ✓ Remove custom shadows and use --shadow-* variables');
    console.log('\nRun with --fix flag to attempt automatic fixes\n');

    return totalIssues;
  }

  getIcon(type) {
    const icons = {
      spacing: '📏',
      typography: '🔤',
      color: '🎨',
      borderRadius: '⭕',
      shadow: '👥',
    };
    return icons[type] || '⚠️';
  }
}

// Run migration
const migration = new AppleDesignMigration();
migration.scanCSSFiles();
const issueCount = migration.printReport();

process.exit(issueCount > 0 ? 1 : 0);
