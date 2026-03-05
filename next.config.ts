import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  async rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
    const posthogAssetHost = 'https://us-assets.i.posthog.com';

    return {
      afterFiles: [
        {
          source: '/ingest/static/:path*',
          destination: `${posthogAssetHost}/static/:path*`,
        },
        {
          source: '/ingest/:path*',
          destination: `${posthogHost}/:path*`,
        },
        {
          source: '/ingest/decide',
          destination: `${posthogHost}/decide`,
        },
      ],
      beforeFiles: [
        // Category slug translations (must come before generic /articles/:path*)
        { source: '/en/articles/sleep/:path*', destination: '/en/articoli/sonno/:path*' },
        { source: '/en/articles/sleep', destination: '/en/articoli/sonno' },
        { source: '/en/articles/exercise/:path*', destination: '/en/articoli/esercizio/:path*' },
        { source: '/en/articles/exercise', destination: '/en/articoli/esercizio' },
        { source: '/en/articles/nutrition/:path*', destination: '/en/articoli/nutrizione/:path*' },
        { source: '/en/articles/nutrition', destination: '/en/articoli/nutrizione' },
        { source: '/en/articles/hair/:path*', destination: '/en/articoli/capelli/:path*' },
        { source: '/en/articles/hair', destination: '/en/articoli/capelli' },
        { source: '/en/articles/longevity/:path*', destination: '/en/articoli/longevita/:path*' },
        { source: '/en/articles/longevity', destination: '/en/articoli/longevita' },
        { source: '/en/articles/technology/:path*', destination: '/en/articoli/tecnologie/:path*' },
        { source: '/en/articles/technology', destination: '/en/articoli/tecnologie' },
        // skin-care stays the same
        { source: '/en/articles/skin-care/:path*', destination: '/en/articoli/skin-care/:path*' },
        { source: '/en/articles/skin-care', destination: '/en/articoli/skin-care' },

        // Recipe category slug translations (must come before generic /recipes/:path*)
        { source: '/en/recipes/sleep/:path*', destination: '/en/ricette/sonno/:path*' },
        { source: '/en/recipes/sleep', destination: '/en/ricette/sonno' },
        { source: '/en/recipes/exercise/:path*', destination: '/en/ricette/esercizio/:path*' },
        { source: '/en/recipes/exercise', destination: '/en/ricette/esercizio' },
        { source: '/en/recipes/nutrition/:path*', destination: '/en/ricette/nutrizione/:path*' },
        { source: '/en/recipes/nutrition', destination: '/en/ricette/nutrizione' },
        { source: '/en/recipes/longevity/:path*', destination: '/en/ricette/longevita/:path*' },
        { source: '/en/recipes/longevity', destination: '/en/ricette/longevita' },
        { source: '/en/recipes/hair/:path*', destination: '/en/ricette/capelli/:path*' },
        { source: '/en/recipes/hair', destination: '/en/ricette/capelli' },
        { source: '/en/recipes/technology/:path*', destination: '/en/ricette/tecnologie/:path*' },
        { source: '/en/recipes/technology', destination: '/en/ricette/tecnologie' },
        { source: '/en/recipes/skin-care/:path*', destination: '/en/ricette/skin-care/:path*' },
        { source: '/en/recipes/skin-care', destination: '/en/ricette/skin-care' },

        // Top-level path translations
        { source: '/en/articles/:path*', destination: '/en/articoli/:path*' },
        { source: '/en/articles', destination: '/en/articoli' },
        { source: '/en/recipes/:path*', destination: '/en/ricette/:path*' },
        { source: '/en/recipes', destination: '/en/ricette' },
        { source: '/en/services/protocols/:path*', destination: '/en/servizi/protocolli/:path*' },
        { source: '/en/services/:path*', destination: '/en/servizi/:path*' },
        { source: '/en/services', destination: '/en/servizi' },
        { source: '/en/longevity-calculator/:path*', destination: '/en/calcolo-longevita/:path*' },
        { source: '/en/longevity-calculator', destination: '/en/calcolo-longevita' },
        { source: '/en/biological-age/:path*', destination: '/en/eta-biologica/:path*' },
        { source: '/en/biological-age', destination: '/en/eta-biologica' },
        { source: '/en/life-expectancy/:path*', destination: '/en/aspettativa-di-vita/:path*' },
        { source: '/en/life-expectancy', destination: '/en/aspettativa-di-vita' },
        { source: '/en/glossary/:path*', destination: '/en/glossario/:path*' },
        { source: '/en/glossary', destination: '/en/glossario' },
        { source: '/en/locations/:path*', destination: '/en/sedi/:path*' },
        { source: '/en/locations', destination: '/en/sedi' },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
