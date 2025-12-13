'use client';

import { useEffect } from 'react';

interface PostContentProps {
  content: string;
  className?: string;
}

export function PostContent({ content, className }: PostContentProps) {
  useEffect(() => {
    // Add error handling to all images in the content
    const images = document.querySelectorAll(`[data-post-content] img`);
    
    images.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      
      // Check if image is already broken
      if (!imgElement.complete || imgElement.naturalHeight === 0) {
        replaceBrokenImage(imgElement);
      }
      
      // Add error handler for future broken images
      imgElement.addEventListener('error', () => {
        replaceBrokenImage(imgElement);
      });
      
      // Add load event to ensure image is loaded
      imgElement.addEventListener('load', () => {
        imgElement.classList.add('loaded');
      });
    });
    
    return () => {
      // Cleanup event listeners
      images.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        imgElement.removeEventListener('error', () => {
          replaceBrokenImage(imgElement);
        });
      });
    };
  }, [content]);

  const replaceBrokenImage = (imgElement: HTMLImageElement) => {
    // Create a wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'image-fallback-wrapper';
    wrapper.style.cssText = `
      display: inline-block;
      max-width: 100%;
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      color: #999;
      font-size: 14px;
      position: relative;
      overflow: hidden;
    `;

    // Set dimensions
    if (imgElement.width) {
      wrapper.style.width = imgElement.width + 'px';
    } else if (imgElement.style.width) {
      wrapper.style.width = imgElement.style.width;
    } else {
      wrapper.style.maxWidth = '100%';
      wrapper.style.width = 'auto';
    }

    if (imgElement.height) {
      wrapper.style.height = imgElement.height + 'px';
    } else if (imgElement.style.height) {
      wrapper.style.height = imgElement.style.height;
    }

    // Create content
    const content = document.createElement('div');
    content.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 100%;
      min-height: 100px;
    `;

    // Add icon SVG
    const icon = document.createElement('svg');
    icon.setAttribute('width', '40');
    icon.setAttribute('height', '40');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', '#ccc');
    icon.setAttribute('stroke-width', '1.5');
    icon.innerHTML = `
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    `;

    // Add text
    const text = document.createElement('p');
    text.textContent = 'Image unavailable';
    text.style.margin = '0';
    text.style.fontSize = '14px';
    text.style.color = '#999';

    // Add alt text if available
    if (imgElement.alt) {
      const altText = document.createElement('small');
      altText.textContent = `(${imgElement.alt})`;
      altText.style.cssText = `
        margin-top: 4px;
        color: #bbb;
        font-size: 12px;
        display: block;
      `;
      content.appendChild(text);
      content.appendChild(altText);
    } else {
      content.appendChild(text);
    }

    content.insertBefore(icon, content.firstChild);
    wrapper.appendChild(content);

    // Replace image with wrapper
    imgElement.parentNode?.replaceChild(wrapper, imgElement);
  };

  return (
    <div
      className={className}
      data-post-content
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
