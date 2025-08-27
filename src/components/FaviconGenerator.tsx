'use client';

import React from 'react';

export const FaviconGenerator = () => {
  const generateCompassSVG = (size: number, includeText = false) => {
    const scale = size / 32;
    const strokeWidth = Math.max(1, 2 * scale);
    const centerStrokeWidth = Math.max(0.5, 1 * scale);
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        ${size >= 192 ? `<circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#f8fafc"/>` : ''}
        
        <!-- Outer compass ring -->
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - strokeWidth}" fill="none" stroke="#475569" stroke-width="${strokeWidth}"/>
        
        <!-- Inner compass face -->
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - size/2.5}" fill="${size >= 192 ? '#ffffff' : '#f8fafc'}" stroke="#06b6d4" stroke-width="${centerStrokeWidth}"/>
        
        <!-- Compass needle -->
        <path d="M${size/2} ${size/5} L${size/2 - size/16} ${size/2 - size/8} L${size/2} ${size/2 - size/10} L${size/2 + size/16} ${size/2 - size/8} Z" fill="#06b6d4"/>
        <path d="M${size/2} ${size - size/5} L${size/2 - size/16} ${size/2 + size/8} L${size/2} ${size/2 + size/10} L${size/2 + size/16} ${size/2 + size/8} Z" fill="#475569"/>
        
        ${size >= 64 ? `
        <!-- Direction markers -->
        <circle cx="${size - size/6}" cy="${size/2}" r="${size/32}" fill="#64748b"/>
        <circle cx="${size/6}" cy="${size/2}" r="${size/32}" fill="#64748b"/>
        <circle cx="${size/2}" cy="${size/6}" r="${size/64}" fill="#06b6d4"/>
        <circle cx="${size/2}" cy="${size - size/6}" r="${size/64}" fill="#475569"/>
        ` : ''}
        
        <!-- Center point -->
        <circle cx="${size/2}" cy="${size/2}" r="${Math.max(1, size/20)}" fill="#475569"/>
        
        ${includeText && size >= 256 ? `
        <text x="${size/2}" y="${size - size/16}" font-family="system-ui, -apple-system, sans-serif" font-size="${size/16}" font-weight="600" text-anchor="middle" fill="#475569">BrokerageCalc</text>
        ` : ''}
      </svg>
    `;
  };

  const svgToCanvas = (svgString: string, size: number): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = size;
      canvas.height = size;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };

      img.src = url;
    });
  };

  const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const generateAndDownload = async (size: number, filename: string, includeText = false) => {
    try {
      const svg = generateCompassSVG(size, includeText);
      const canvas = await svgToCanvas(svg, size);
      downloadCanvas(canvas, filename);
    } catch (error) {
      console.error('Error generating favicon:', error);
    }
  };

  const generateAllFavicons = async () => {
    const favicons = [
      { size: 16, filename: 'favicon-16x16.png' },
      { size: 32, filename: 'favicon-32x32.png' },
      { size: 180, filename: 'apple-touch-icon.png' },
      { size: 192, filename: 'android-chrome-192x192.png' },
      { size: 512, filename: 'android-chrome-512x512.png', includeText: true },
    ];

    for (const favicon of favicons) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between downloads
      await generateAndDownload(favicon.size, favicon.filename, favicon.includeText);
    }
  };

  const generateICO = async () => {
    // Generate a multi-size ICO file (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const canvases = await Promise.all(
      sizes.map(async (size) => {
        const svg = generateCompassSVG(size);
        return await svgToCanvas(svg, size);
      })
    );

    // For ICO generation, you'd need a library like 'ico-js' or similar
    // For now, just download the 32x32 as ICO format
    const canvas32 = canvases[1];
    const link = document.createElement('a');
    link.download = 'favicon.ico';
    link.href = canvas32.toDataURL('image/x-icon');
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favicon Generator</h2>
      <p className="text-gray-600 mb-8">
        Generate all necessary favicon formats for BrokerageCalc using the custom compass logo.
      </p>

      {/* Preview Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div 
            className="w-4 h-4 bg-contain bg-no-repeat" 
            style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(generateCompassSVG(16))}")` }}
          />
          <span className="text-sm text-gray-600">16x16 (Browser Tab)</span>
          
          <div 
            className="w-8 h-8 bg-contain bg-no-repeat ml-4" 
            style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(generateCompassSVG(32))}")` }}
          />
          <span className="text-sm text-gray-600">32x32 (Bookmarks)</span>
          
          <div 
            className="w-12 h-12 bg-contain bg-no-repeat ml-4" 
            style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(generateCompassSVG(48))}")` }}
          />
          <span className="text-sm text-gray-600">48x48 (Desktop)</span>
        </div>
      </div>

      {/* Individual Downloads */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Individual Sizes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateAndDownload(16, 'favicon-16x16.png')}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            16x16 PNG
          </button>
          <button
            onClick={() => generateAndDownload(32, 'favicon-32x32.png')}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            32x32 PNG
          </button>
          <button
            onClick={() => generateAndDownload(180, 'apple-touch-icon.png')}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            180x180 Apple
          </button>
          <button
            onClick={() => generateAndDownload(192, 'android-chrome-192x192.png')}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            192x192 Android
          </button>
          <button
            onClick={() => generateAndDownload(512, 'android-chrome-512x512.png', true)}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            512x512 Android
          </button>
          <button
            onClick={generateICO}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            favicon.ico
          </button>
        </div>
      </div>

      {/* Bulk Download */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Bulk Generation</h3>
        <button
          onClick={generateAllFavicons}
          className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
        >
          Generate All Favicon Files
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Downloads all required favicon files for web and mobile apps
        </p>
      </div>

      {/* Installation Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Installation Instructions</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li>1. Generate all favicon files using the button above</li>
          <li>2. Place all downloaded files in your <code className="bg-gray-200 px-1 rounded">/public</code> folder</li>
          <li>3. The favicon links are already configured in your layout.tsx</li>
          <li>4. Clear browser cache and refresh to see new favicons</li>
        </ol>
      </div>
    </div>
  );
};
