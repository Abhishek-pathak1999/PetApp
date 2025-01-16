import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.easternrays.app.parent',
  appName: 'MyPetBookParent',
  webDir: 'dist',
  // plugins: {
  //   StatusBar: {
  //     backgroundColor: '#fff', // Replace with your app color
  //     style: 'LIGHT', // or 'LIGHT' depending on your color scheme
  //   }
  // },
  server: {
    androidScheme: 'https'
  }
};

export default config;
