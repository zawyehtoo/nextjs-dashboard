/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        ppr: 'incremental',
      },
    images:{
      domains:['avatars.githubusercontent.com'],
    },
    trustHost:true
};

export default nextConfig;
