const nextConfig = {
  serverExternalPackages: ['postgres', 'bcrypt', 'nodemailer'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        os: false,
        crypto: false,
        stream: false,
        path: false,
        util: false,
        buffer: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
      };
    }
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

export default nextConfig;
