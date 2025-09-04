// import puppeteer from 'puppeteer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import http from 'http';
// import { createReadStream, statSync } from 'fs';
// import { extname } from 'path';

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const routes = ['/', '/quest', '/assessment', '/experience'];
// const distDir = path.join(__dirname, '..', 'dist');

// // Simple static file server
// function createServer() {
//   const server = http.createServer((req, res) => {
//     let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
    
//     // If the path doesn't have an extension, serve index.html
//     if (!extname(filePath)) {
//       filePath = path.join(distDir, 'index.html');
//     }
    
//     try {
//       const stat = statSync(filePath);
//       if (stat.isFile()) {
//         const ext = extname(filePath);
//         const contentTypes = {
//           '.html': 'text/html',
//           '.js': 'application/javascript',
//           '.css': 'text/css',
//           '.json': 'application/json',
//           '.png': 'image/png',
//           '.jpg': 'image/jpeg',
//           '.gif': 'image/gif',
//           '.svg': 'image/svg+xml',
//           '.woff': 'font/woff',
//           '.woff2': 'font/woff2',
//           '.ttf': 'font/ttf'
//         };
        
//         res.writeHead(200, {
//           'Content-Type': contentTypes[ext] || 'text/plain',
//           'Cache-Control': 'no-cache'
//         });
        
//         createReadStream(filePath).pipe(res);
//       } else {
//         throw new Error('Not a file');
//       }
//     } catch (err) {
//       res.writeHead(404);
//       res.end('Not found');
//     }
//   });
  
//   return server;
// }

// async function prerender() {
//   console.log('🚀 Starting prerendering...');
  
//   // Start our simple server
//   const server = createServer();
//   const port = 3001;
  
//   await new Promise((resolve) => {
//     server.listen(port, () => {
//       console.log(`📡 Local server started on http://localhost:${port}`);
//       resolve();
//     });
//   });
  
//   try {
//     const browser = await puppeteer.launch({ 
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
    
//     for (const route of routes) {
//       console.log(`📄 Prerendering ${route}...`);
      
//       const page = await browser.newPage();
      
//       // Use the local server
//       const url = `http://localhost:${port}${route}`;
      
//       await page.goto(url, { 
//         waitUntil: 'networkidle0',
//         timeout: 30000 
//       });
      
//       // Wait for React to fully render
//       await new Promise(r => setTimeout(r, 2000));
      
//       // Get the rendered HTML
//       const html = await page.content();
      
//       // Create directory for route
//       const routeDir = route === '/' ? distDir : path.join(distDir, route);
//       if (!fs.existsSync(routeDir)) {
//         fs.mkdirSync(routeDir, { recursive: true });
//       }
      
//       // Save the HTML
//       const filePath = path.join(routeDir, 'index.html');
//       fs.writeFileSync(filePath, html);
      
//       console.log(`✅ Created ${filePath}`);
//       await page.close();
//     }
    
//     await browser.close();
//     console.log('🎉 Prerendering completed successfully!');
    
//   } catch (error) {
//     console.error('❌ Prerendering failed:', error);
//     throw error;
//   } finally {
//     // Close the server
//     server.close();
//     console.log('🛑 Server stopped');
//   }
// }

// prerender().catch((error) => {
//   console.error('❌ Prerendering failed:', error);
//   process.exit(1);
// });

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { createReadStream, statSync } from 'fs';
import { extname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = ['/', '/quest', '/assessment', '/experience'];
const distDir = path.join(__dirname, '..', 'dist');

// Simple static file server
function createServer() {
  const server = http.createServer((req, res) => {
    let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
    
    // If the path doesn't have an extension, serve index.html
    if (!extname(filePath)) {
      filePath = path.join(distDir, 'index.html');
    }
    
    try {
      const stat = statSync(filePath);
      if (stat.isFile()) {
        const ext = extname(filePath);
        const contentTypes = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.ttf': 'font/ttf'
        };
        
        res.writeHead(200, {
          'Content-Type': contentTypes[ext] || 'text/plain',
          'Cache-Control': 'no-cache'
        });
        
        createReadStream(filePath).pipe(res);
      } else {
        throw new Error('Not a file');
      }
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  return server;
}

async function prerender() {
  console.log('🚀 Starting prerendering...');
  
  // Start our simple server
  const server = createServer();
  const port = 3001;
  
  await new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`📡 Local server started on http://localhost:${port}`);
      resolve();
    });
  });
  
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    for (const route of routes) {
      console.log(`📄 Prerendering ${route}...`);
      
      const page = await browser.newPage();
      
      // Use the local server
      const url = `http://localhost:${port}${route}`;
      
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for React to fully render
      console.log(`   ⏳ Waiting for React to render ${route}...`);
      await new Promise(r => setTimeout(r, 8000)); // Increased from 5000 to 8000
      
      // Wait for specific meta tags to be set (this checks if your app is setting them)
      try {
        await page.waitForFunction(() => {
          const title = document.title;
          const metaDesc = document.querySelector('meta[name="description"]');
          
          // Check if title has changed from the default
          return title && title !== 'Fraterny' && title !== 'Fraterny - Where Ambition Finds Its Tribe';
        }, { timeout: 10000 });
        
        console.log(`   ✅ Meta tags detected for ${route}`);
      } catch (e) {
        console.log(`   ⚠️ Meta tags not changed for ${route}, using default...`);
      }
      
      // Additional wait to ensure everything is rendered
      await new Promise(r => setTimeout(r, 2000));
      
      // Wait for analytics scripts to be added to the DOM
      console.log(`   ⏳ Waiting for analytics scripts to load...`);
      try {
        await page.waitForFunction(() => {
          const scripts = Array.from(document.querySelectorAll('script'));
          return scripts.some(script => 
            script.src && script.src.includes('gtag') && script.src.includes('G-MVGZTCT1DK')
          );
        }, { timeout: 10000 });
        console.log(`   ✅ Analytics scripts detected in DOM`);
      } catch (e) {
        console.log(`   ⚠️ Analytics scripts not found, continuing anyway...`);
      }

      // Additional wait to ensure gtag config is also added
      await new Promise(r => setTimeout(r, 2000));

      // Check what analytics scripts are present BEFORE capturing HTML
      const analyticsScripts = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script'));
        return scripts
          .map(script => ({
            src: script.src || 'inline',
            content: script.innerHTML.substring(0, 200)
          }))
          .filter(script => 
            script.src.includes('gtag') || 
            script.content.includes('gtag') || 
            script.content.includes('G-MVGZTCT1DK')
          );
      });
      
      console.log(`   📊 Analytics scripts found: ${analyticsScripts.length}`);
      analyticsScripts.forEach((script, i) => {
        console.log(`   📊 Script ${i + 1}: ${script.src === 'inline' ? 'inline gtag config' : script.src}`);
      });
      
      // Get the rendered HTML
      const html = await page.content();
      
      // Log what title was captured
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const capturedTitle = titleMatch ? titleMatch[1] : 'No title found';
      console.log(`   📋 Captured title: "${capturedTitle}"`);
      
      // Create directory for route
      const routeDir = route === '/' ? distDir : path.join(distDir, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      // Save the HTML
      const filePath = path.join(routeDir, 'index.html');
      fs.writeFileSync(filePath, html);
      
      console.log(`✅ Created ${filePath}`);
      await page.close();
    }
    
    await browser.close();
    console.log('🎉 Prerendering completed successfully!');
    
  } catch (error) {
    console.error('❌ Prerendering failed:', error);
    throw error;
  } finally {
    // Close the server
    server.close();
    console.log('🛑 Server stopped');
  }
}

prerender().catch((error) => {
  console.error('❌ Prerendering failed:', error);
  process.exit(1);
});