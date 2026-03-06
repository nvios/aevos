import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
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
    };
  },
};

export default withNextIntl(nextConfig);
