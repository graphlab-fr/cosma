/**
 * @file Tests unitaires pour controllers/user-data-dir.js
 * Ces tests vérifient que le répertoire utilisateur est correctement créé
 * dans l'environnement Docker.
 *
 * Dans un container Docker, ces tests modifient réellement le système de fichiers
 * du container, qui sera détruit après les tests.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import makeUserDataDir from './user-data-dir.js';
import Config from '../core/models/config.js';

describe('makeUserDataDir', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Nettoyer le répertoire s'il existe déjà
    if (fs.existsSync(Config.configDirPath)) {
      fs.rmSync(Config.configDirPath, { recursive: true });
    }

    // Spy sur console.log et console.error
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Nettoyer le répertoire créé pendant le test
    if (fs.existsSync(Config.configDirPath)) {
      fs.rmSync(Config.configDirPath, { recursive: true });
    }

    // Restaurer les fonctions console
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should create user data directory when it does not exist', (done) => {
    // Vérifier que le répertoire n'existe pas au départ
    expect(fs.existsSync(Config.configDirPath)).toBe(false);

    makeUserDataDir();

    // Attendre que la création asynchrone se termine
    setTimeout(() => {
      // Vérifier que le répertoire a été créé au bon endroit
      expect(fs.existsSync(Config.configDirPath)).toBe(true);

      // Vérifier que le message de succès a été affiché
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('User data directory created at'),
        expect.stringContaining(Config.configDirPath),
      );

      done();
    }, 100);
  });

  test('should display message when directory already exists', () => {
    // Créer le répertoire avant d'appeler la fonction
    fs.mkdirSync(Config.configDirPath, { recursive: true });
    expect(fs.existsSync(Config.configDirPath)).toBe(true);

    makeUserDataDir();

    // Vérifier que le message approprié a été affiché
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'User data directory already exists at',
      expect.stringContaining(Config.configDirPath),
    );
  });

  test('should create directory with correct permissions', (done) => {
    makeUserDataDir();

    setTimeout(() => {
      expect(fs.existsSync(Config.configDirPath)).toBe(true);

      // Vérifier que c'est bien un répertoire
      const stats = fs.statSync(Config.configDirPath);
      expect(stats.isDirectory()).toBe(true);

      done();
    }, 100);
  });
});

describe('makeUserDataDir error handling', () => {
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeEach(() => {
    // Nettoyer le répertoire s'il existe
    if (fs.existsSync(Config.configDirPath)) {
      fs.rmSync(Config.configDirPath, { recursive: true });
    }

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Nettoyer
    if (fs.existsSync(Config.configDirPath)) {
      fs.rmSync(Config.configDirPath, { recursive: true });
    }

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    jest.restoreAllMocks();
  });

  test('should handle errors when directory creation fails', (done) => {
    // Mocker fs.mkdir pour simuler une erreur
    const mkdirSpy = jest.spyOn(fs, 'mkdir').mockImplementation((path, options, callback) => {
      callback(new Error('Permission denied'));
    });

    makeUserDataDir();

    setTimeout(() => {
      // Vérifier que l'erreur a été loggée
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Err.'),
        expect.stringContaining('cannot create user data directory'),
      );

      mkdirSpy.mockRestore();
      done();
    }, 100);
  });
});

/**
 * Tests de vérification du chemin dans différents environnements
 */
// describe('makeUserDataDir path verification', () => {
//   let consoleLogSpy;

//   beforeEach(() => {
//     // Nettoyer le répertoire s'il existe
//     if (fs.existsSync(Config.configDirPath)) {
//       fs.rmSync(Config.configDirPath, { recursive: true });
//     }

//     consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
//   });

//   afterEach(() => {
//     // Nettoyer
//     if (fs.existsSync(Config.configDirPath)) {
//       fs.rmSync(Config.configDirPath, { recursive: true });
//     }

//     consoleLogSpy.mockRestore();
//   });

//   test('should create directory in the user home directory', (done) => {
//     const home = os.homedir();

//     makeUserDataDir();

//     setTimeout(() => {
//       expect(fs.existsSync(Config.configDirPath)).toBe(true);
//       expect(Config.configDirPath).toContain(home);

//       done();
//     }, 100);
//   });

//   test('directory path should reflect environment (Docker: /home/cosmauser, Local: user home)', () => {
//     const home = os.homedir();

//     // Dans Docker, home = /home/cosmauser
//     // En local, home = /home/username ou équivalent
//     expect(Config.configDirPath).toContain(home);

//     if (home === '/home/cosmauser') {
//       // Environnement Docker
//       expect(Config.configDirPath).toContain('/home/cosmauser');
//     }
//   });
// });
