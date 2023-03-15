const packageConfig = require('./package.json')

module.exports = {
  hooks: {
    generateAssets: async () => {
      require('./controllers/build-pages');
    }
  },
  packagerConfig: {
    dir: './',
    out: './build/',
    icon: './assets/icons/appicon',
    ignore: './out/*',
    overwrite: true,
    name: 'Cosma',
    executableName: 'Cosma',
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
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {
    //     owners: packageConfig.contributors
    //   },
    // },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './assets/icons/appicon.icns',
        format: 'ULFO'
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["win32"],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          categories: ['Office', 'Science', 'Education'],
          description: packageConfig.description,
          homepage: packageConfig.homepage,
          maintainer: packageConfig.author,
          section: 'science',
          version: packageConfig.version
        }
      },
    },
  ],
};
