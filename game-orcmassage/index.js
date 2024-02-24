const path = require('path');
const { fs, log, util } = require('vortex-api');

const GAME_ID = 'orcmassage';
const STEAMAPP_ID = '1129540';
const MOD_FILE_EXT = ".cs";


function findGame() {
    return util.GameStoreHelper.FindByAppId([STEAMAPP_ID])
        .then(game => game.gamePath);
}


function prepareForModding(discovery) {
    return fs.ensureDirWritableAsync(path.join(discovery.path, 'BepInEx', 'plugins'))
}


// function testSupportedContent(files, gameId) {
//     let supported = (gameId === GAME_ID) &&
//         (files.find(file => path.extname(file).toLowerCase() === MOD_FILE_EXT) !== undefined);
//     return Promise.resolve({
//         supported,
//         requiredFiles: [],
//     });
// }


// function installContent(files) {
//     const modFile = files.find(file => path.extname(file).toLowerCase() === MOD_FILE_EXT);
//     const idx = modFile.indexOf(path.basename(modFile));
//     const rootPath = path.dirname(modFile);
//
//     const filtered = files.filter(file => 
//         ((file.indexOf(rootPath) !== -1) 
//         && (!file.endsWith(path.sep))));
//
//     const instructions = filtered.map(file => {
//         return {
//             type: 'copy',
//             source: file,
//             destination: path.join(file.substr(idx)),
//         };
//     });
//
//     return Promise.resolve({ instructions });
// }


function main(context) {
    context.requireExtension('modtype-bepinex');

    context.registerGame({
        id: GAME_ID,
        name: 'Orc Massage',
        mergeMods: true,
        queryPath: findGame,
        supportedTools: [],
        queryModPath: () => 'BepInEx/plugins',
        logo: 'gameart.jpg',
        executable: () => 'OrcMassage.exe',
        requiredFiles: [
            'OrcMassage.exe'
        ],
        setup: prepareForModding,
        environment: {
            SteamAPPId: STEAMAPP_ID,
        },
        details: {
            steamAppId: STEAMAPP_ID,
        },
    });

    context.once(() => {
        if (context.api.ext.bepinexAddGame !== undefined) {
            context.api.ext.bepinexAddGame({ 
                gameId: GAME_ID, 
                autoDownloadBepInEx: true,
                forceGithubDownload: true,
                architecture: 'x64',
                bepinexVersion: '5.4.22',
                unityBuild: 'unitymono',
            });
        }
    });

    // context.registerInstaller('orcmassage-bepinex-plugin', 25, testSupportedContent, installContent);
    return true
}

module.exports = {
    default: main,
};
