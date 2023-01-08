module.exports = {
  hooks: {
    generateAssets: async () => {
      require('./controllers/build-pages');
    }
  },
  packagerConfig: {
    dir: './',
    out: 'build/',
    icon: './assets/icons/',
    ignore: 'build/*',
    overwrite: true,
    name: 'Cosma',
    executableName: 'cosma',
    appCopyright: 'ANR HyperOtlet GPL-3.0-or-later'
  },
  rebuildConfig: {
    buildPath: './',
    electronVersion: '21.2.3'
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      draft: true,
      config: {
        repository: {
          owner: 'graphlab-fr',
          name: 'cosma'
        },
        prerelease: true
      }
    }
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
