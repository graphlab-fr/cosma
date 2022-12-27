module.exports = {
  packagerConfig: {
    dir: './',
    out: 'build',
    icon: './assets/icons/',
    ignore: 'build/*',
    overwrite: true,
    name: 'Cosma',
    appCopyright: 'ANR HyperOtlet GPL-3.0-or-later'
  },
  rebuildConfig: {
    buildPath: './',
    electronVersion: '21.2.3'
  },
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
