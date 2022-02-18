const withPWA = require('next-pwa')

let runtimeCaching = [
  {
    urlPattern: /\.(?:mp3|wav|ogg)$/i,
    handler: 'CacheFirst',
    options: {
      rangeRequests: true,
      cacheName: 'static-audio-assets',
      expiration: {
        maxAgeSeconds: 2 * 365 * 7 * 24 * 60 * 60 // 24 hours
      }
    }
  },
  {
    urlPattern: () => true,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'stale-cache',
      expiration: {}
    }
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    runtimeCaching
  }
}

module.exports = withPWA(nextConfig)