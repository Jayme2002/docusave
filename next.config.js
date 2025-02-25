/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing configuration ...
  
  // Add this to exclude favicon.ico from being handled by dynamic routes
  redirects: async () => {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.ico',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 