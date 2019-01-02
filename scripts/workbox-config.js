module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{html,json,js,css}'],
  swDest: 'build/service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
  // Define runtime caching rules.
  runtimeCaching: [
    {
      // Match any request ends with .png, .jpg, .jpeg or .svg.
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

      // Apply a cache-first strategy.
      handler: 'cacheFirst',

      options: {
        // Use a custom cache name.
        cacheName: 'images',

        // Only cache 10 images.
        expiration: {
          maxEntries: 10,
        },
      },
    },
  ],
};
