import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  async rewrites() {
    return {
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
