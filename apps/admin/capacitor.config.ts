import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shriayurved.admin',
  appName: 'Shri Ayurved Admin',
  server: {
    url: 'https://nx-admin-three.vercel.app/',
    cleartext: false,
  },
};

export default config;