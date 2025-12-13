# Image Handling - Quick Start Guide

## For Content Editors

### Writing Posts with Images
When creating post content with embedded images:

1. **HTML images will auto-fallback**
   - No special setup needed
   - Broken images show styled placeholder
   - Original alt text is preserved

2. **What happens if image is broken:**
   ```
   [X] Image → Shows → [Icon] Image unavailable
   ```

3. **Best practices:**
   - Always include alt text
   - Use descriptive captions
   - Host images on reliable CDN
   - Test links before publishing

## For Developers

### Using Images in Components

#### Static/Featured Images
```tsx
import ImageWithFallback from '@/components/ImageWithFallback';

<ImageWithFallback
  src={imageUrl}
  alt="Description"
  fill
  priority
  fallback="/images/placeholder.svg"
/>
```

#### Content with Embedded Images
```tsx
import { PostContent } from '@/components/PostContent';

<PostContent
  content={htmlString}
  className="my-class"
/>
```

#### Static Icons
```tsx
import Image from 'next/image';

<Image
  src="/icons/facebook.svg"
  alt="Share on Facebook"
  width={20}
  height={20}
/>
```

### Adding New Icons

1. **Create SVG file**
   - Save to `/public/icons/myicon.svg`
   - Keep dimensions consistent (20x20, 24x24)
   - Use `fill="currentColor"` for styling

2. **Use in component**
   ```tsx
   <Image
     src="/icons/myicon.svg"
     alt="Icon description"
     width={20}
     height={20}
   />
   ```

### Updating Placeholder

Edit `/public/images/placeholder.svg` to change fallback appearance.

**Current placeholder:**
- Gray background
- Image icon
- "Image Unavailable" text

## Troubleshooting

### Broken Images Not Showing Fallback
1. Check browser console for errors
2. Verify image URL is valid
3. Clear browser cache
4. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Icon Not Displaying
1. Verify file exists in `/public/icons/`
2. Check file name spelling
3. Confirm SVG is valid XML
4. Check browser console for errors

### Image Loading Slowly
1. Check file size
2. Verify server response time
3. Test with slow network (DevTools)
4. Consider using CDN

### Placeholder Not Styled Correctly
1. Check CSS in `ImageWithFallback.module.css`
2. Verify no conflicting styles
3. Check parent container width
4. Test in different browsers

## Common Issues & Solutions

### Issue: CORS Error with External Images
**Solution:**
- Use images from same domain
- Or use image proxy service
- Or ask host to enable CORS headers

### Issue: Images Look Blurry
**Solution:**
- Check source image resolution
- Verify Next.js image optimization working
- Use high-quality source images
- Check viewport size

### Issue: Placeholder Shows for Valid Image
**Solution:**
- Check network tab in DevTools
- Verify image URL is accessible
- Check Content-Type header
- Ensure MIME type is image/*

## Best Practices

### For Images
✅ Use descriptive alt text
✅ Optimize before uploading
✅ Use WebP when possible
✅ Host on reliable CDN
✅ Test links before publishing
✅ Provide multiple formats
✅ Compress large images

### For Components
✅ Use `ImageWithFallback` for user content
✅ Use `PostContent` for HTML strings
✅ Set `priority` for above-fold images
✅ Specify dimensions when possible
✅ Use `fill` only when necessary
✅ Test with slow network

### For Content
✅ Always include alt text
✅ Describe image content
✅ Use relative paths when possible
✅ Test on multiple browsers
✅ Monitor for broken links
✅ Update URLs when moving images

## Performance Tips

1. **Lazy Load Below Fold**
   - Don't set `priority` for below-fold images
   - Next.js handles lazy loading

2. **Optimize Image Size**
   - Use appropriate dimensions
   - Compress before uploading
   - Consider WebP format

3. **Cache Images**
   - Static icons: 1 year cache
   - User content: Browser default
   - CDN: Configure headers

4. **Monitor Performance**
   - Check Lighthouse scores
   - Monitor image load times
   - Track Core Web Vitals

## Quick Command Reference

```bash
# Build the project
npm run build

# Start development server
npm run dev

# Build for production
npm run build
npm run start

# Check for issues
npm run lint
```

## Files Quick Reference

| File | Purpose | Edit When |
|------|---------|-----------|
| `/public/icons/*.svg` | UI icons | Adding new icon |
| `/public/images/placeholder.svg` | Fallback image | Changing fallback |
| `src/components/ImageWithFallback.tsx` | Image wrapper | Customizing fallback logic |
| `src/components/PostContent.tsx` | HTML content | Customizing content fallback |
| `src/components/ImageWithFallback.module.css` | Fallback styling | Changing fallback appearance |

## Getting Help

### Common Documentation
- `IMAGE_HANDLING_SUMMARY.md` - Complete system overview
- `ICONS_AND_FALLBACKS.md` - Icon and fallback details
- `POST_CONTENT_FALLBACKS.md` - Content image handling
- `ISR_STATIC_BUILD.md` - Build and caching strategy

### Checking Logs

```bash
# Build logs
npm run build 2>&1 | grep -i error

# Development logs
npm run dev 2>&1 | grep -i image

# Browser console
Open DevTools (F12) → Console tab
```

### Testing Images

```tsx
// Test component
<ImageWithFallback
  src="https://example.com/broken-image.jpg"
  alt="Test"
  width={200}
  height={200}
  fallback="/images/placeholder.svg"
/>
```

## Summary

✅ **Images are handled gracefully**
- Broken images show placeholder
- No broken image icons
- Consistent styling

✅ **Icons are optimized**
- Static SVG files
- Cached by browsers
- Consistent across site

✅ **Content images are safe**
- Auto-fallback on error
- Preserves alt text
- Maintains layout

✅ **Performance is optimized**
- Smaller bundles
- Better caching
- Fewer network requests

**Next Steps:**
1. Review `IMAGE_HANDLING_SUMMARY.md` for complete guide
2. Test image fallbacks locally
3. Deploy with confidence
4. Monitor image performance
