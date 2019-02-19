module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{json,js,css}'],
  swDest: 'build/service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 50,
        },
      },
    },
    {
      urlPattern: /api\/devices/,
      handler: 'staleWhileRevalidate',
      options: {
        cacheName: 'api-data',
        expiration: {
          maxEntries: 10,
        },
      },
    },
    {
      urlPattern: /\//,
      handler: 'staleWhileRevalidate',
      options: {
        cacheName: 'page',
        expiration: {
          maxEntries: 10,
        },
      },
    },
  ],
};
