import { type RenderResult } from "../client/src/entry-server";
import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

/**
 * Renders a page with SSR (Production only)
 */
export async function renderPageSSR(url: string, template: string): Promise<string> {
  if (!isProd) {
    // Development: No SSR, return template as-is
    return template;
  }

  // Production: Load prebuilt server entry
  const serverEntryPath = path.resolve(
    import.meta.dirname,
    "../dist/server/entry-server.js"
  );
  
  if (!fs.existsSync(serverEntryPath)) {
    console.warn(`⚠️  SSR server entry not found: ${serverEntryPath}`);
    console.warn('⚠️  Falling back to CSR. Run build script for SSR.');
    return template;
  }

  try {
    // Dynamic import of production server bundle
    const { render } = await import(serverEntryPath);

    // Render the React app
    const { html: appHtml, dehydratedState } = await render(url);

    // Inject the rendered HTML and dehydrated state into template
    let finalHtml = template;
    
    // Replace #root div content with SSR HTML
    // Match: <div id="root">...</div> and replace inner content
    finalHtml = finalHtml.replace(
      /<div id="root"[^>]*>[\s\S]*?<\/div>/,
      `<div id="root">${appHtml}</div>`
    );
    
    // Inject dehydrated state before closing body tag
    const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState).replace(/</g, '\\u003c')};</script>`;
    finalHtml = finalHtml.replace(
      /<\/body>/,
      `${stateScript}\n  </body>`
    );

    return finalHtml;
  } catch (error) {
    console.error('❌ SSR rendering error:', error);
    console.warn('⚠️  Falling back to CSR');
    return template;
  }
}
