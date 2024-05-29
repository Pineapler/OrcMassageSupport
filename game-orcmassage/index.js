const path = require('path');
const { fs, log, util } = require('vortex-api');

const GAME_ID = 'orcmassage';
const STEAMAPP_ID = '1129540';
const MOD_FILE_EXT = ".cs";


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
                architecture: 'x64',
                bepinexVersion: '5.4.21',
                forceGithubDownload: true,
            });
        }
    });

    return true
}


function findGame() {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID])
        .then(game => game.gamePath);
}


function prepareForModding(discovery) {
    return fs.ensureDirWritableAsync(path.join(discovery.path, 'BepInEx'))
}


module.exports = {
    default: main,
};
