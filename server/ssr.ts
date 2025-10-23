import { type ViteDevServer } from "vite";
import { type RenderResult } from "../client/src/entry-server";
import fs from "fs";
import path from "path";

interface SSRContext {
  vite?: ViteDevServer;
  isProd: boolean;
}

let context: SSRContext = {
  isProd: process.env.NODE_ENV === "production",
};

export function setViteServer(vite: ViteDevServer) {
  context.vite = vite;
}

export async function renderPage(url: string, template: string): Promise<string> {
  let render: (url: string) => Promise<RenderResult>;

  if (context.isProd) {
    // Production: Load prebuilt server entry
    const serverEntryPath = path.resolve(
      import.meta.dirname,
      "../dist/server/entry-server.js"
    );
    
    if (!fs.existsSync(serverEntryPath)) {
      throw new Error(
        `SSR server entry not found: ${serverEntryPath}. Run 'npm run build:ssr' first.`
      );
    }

    const { render: prodRender } = await import(serverEntryPath);
    render = prodRender;
  } else {
    // Development: Load via Vite SSR
    if (!context.vite) {
      throw new Error("Vite server not initialized for SSR");
    }

    const { render: devRender } = await context.vite.ssrLoadModule(
      "/src/entry-server.tsx"
    );
    render = devRender;
  }

  // Render the React app
  const { html: appHtml, dehydratedState } = await render(url);

  // Inject the rendered HTML and dehydrated state into template
  const finalHtml = template
    .replace(`<!--app-html-->`, appHtml)
    .replace(
      `<!--app-state-->`,
      `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};</script>`
    );

  return finalHtml;
}
