import { getAllocatedRam, getFileOrFolderPath, getJvmOptions, getResolution, getUserData } from '../config';
import { spawn } from 'child_process';
import * as fs from 'fs';

export default class GameBootstraper {
    constructor() {
        this.events = [];
    }

    run() {
        // init
        this.emit(Events.UpdateStateChange, 'launching');

        // it's getting the java path
        const javaPath = getJavaPath();

        // it's getting the startup command line
        const minecraftCommandLine = getCommandLine(javaPath);
        const minecraftCommandLineArray = minecraftCommandLine.split(' ');
        const line = minecraftCommandLineArray.shift();

        // it's executing the command line in child process
        const minecraft = spawn(line, minecraftCommandLineArray);

        // it's creating the child process handlers
        minecraft.stdout.on('data', (data) => {
            console.log('stdout: ', data.toString('utf-8'));
        });
        minecraft.stderr.on('data', (data) => {
            console.error('stderr: ', data.toString('utf-8'));
        });
        minecraft.on('close', (code) => {
            this.emit(Events.GameClosed, code);
            console.log('minecraft closed with code ', code);
        });
    }

    on(eventName, callback) {
        this.events.push({
            eventName,
            callback
        });
        return 0;
    }

    emit(eventName, eventData) {
        this.events.forEach((e) => {
            if (e.eventName === eventName) {
                e.callback(eventData);
            }
        });
    }
}

function getJavaPath() {
    return getFileOrFolderPath('java/bin/javaw.exe');
    //return 'C:\\Users\\justn\\AppData\\Roaming\\.minecraft\\runtime\\java-runtime-gamma\\bin\\javaw.exe';
}

function getCommandLine(javaPath) {
    const playerName = getUserData().profile.name;
    const playerUuid = getUserData().profile.id;
    const accessToken = getUserData().minecraftToken;
    const minRam = getAllocatedRam().min;
    const maxRam = getAllocatedRam().max;
    const jvmOptions = getJvmOptions();
    const {width, height} = getResolution();
    const nativesDir = getFileOrFolderPath('natives');
    const libsDir = getFileOrFolderPath('libraries');
    const assetsDir = getFileOrFolderPath('assets');

    const libs = fs.readFileSync(getFileOrFolderPath('libs.txt')).toString('utf-8');
    const forgeLibs = '%libs%/cpw/mods/bootstraplauncher/1.1.2/bootstraplauncher-1.1.2.jar;%libs%/cpw/mods/securejarhandler/2.1.10/securejarhandler-2.1.10.jar;%libs%/org/ow2/asm/asm-commons/9.5/asm-commons-9.5.jar;%libs%/org/ow2/asm/asm-util/9.5/asm-util-9.5.jar;%libs%/org/ow2/asm/asm-analysis/9.5/asm-analysis-9.5.jar;%libs%/org/ow2/asm/asm-tree/9.5/asm-tree-9.5.jar;%libs%/org/ow2/asm/asm/9.5/asm-9.5.jar;%libs%/net/minecraftforge/JarJarFileSystems/0.3.19/JarJarFileSystems-0.3.19.jar';

    const args = [
        javaPath,
        '-Xdiag',
        jvmOptions,
        '-Djava.net.preferIPv4Stack=true',
        `-Xmx${maxRam}m`,
        `-Xms${minRam}m`,
        '-DMcEmu=net.minecraft.client.main.Main',
        '-Dlog4j2.formatMsgNoLookups=true',
        '-Djava.rmi.server.useCodebaseOnly=true',
        '-Dcom.sun.jndi.rmi.object.trustURLCodebase=false',
        '-Dcom.sun.jndi.cosnaming.object.trustURLCodebase=false',
        '-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump',
        `-Djava.library.path=${nativesDir}`,
        `-Djna.tmpdir=${nativesDir}`,
        `-Dorg.lwjgl.system.SharedLibraryExtractPath=${nativesDir}`,
        `-Dio.netty.native.workdir=${nativesDir}`,
        `-Djna.tmpdir=${nativesDir}`,
        '-Dminecraft.launcher.brand=java-minecraft-launcher',
        '-Dminecraft.launcher.version=1.6.93',
        '-cp',
        libs,
        '-Djava.net.preferIPv6Addresses=system',
        '-DignoreList=bootstraplauncher,securejarhandler,asm-commons,asm-util,asm-analysis,asm-tree,asm,JarJarFileSystems,client-extra,fmlcore,javafmllanguage,lowcodelanguage,mclanguage,forge-,1.20.1-forge-47.1.43.jar',
        '-DmergeModules=jna-5.10.0.jar,jna-platform-5.10.0.jar',
        `-DlibraryDirectory=${libsDir}`,
        '-p',
        forgeLibs,
        '--add-modules ALL-MODULE-PATH',
        '--add-opens java.base/java.util.jar=cpw.mods.securejarhandler',
        '--add-opens java.base/java.lang.invoke=cpw.mods.securejarhandler',
        '--add-exports java.base/sun.security.util=cpw.mods.securejarhandler',
        '--add-exports jdk.naming.dns/com.sun.jndi.dns=java.naming',
        'cpw.mods.bootstraplauncher.BootstrapLauncher',
        '--username',
        playerName,
        '--version 1.20.1-forge-47.1.43',
        '--gameDir',
        getFileOrFolderPath(),
        '--assetsDir',
        assetsDir,
        '--assetsIndex 5',
        '-uuid',
        playerUuid,
        '--accessToken',
        accessToken,
        '--clientId 0',
        '--xuid 0',
        '--userType xbox',
        '--versionType release',
        '--width',
        width,
        '--height',
        height,
        '--launchTarget forgeclient',
        '--fml.forgeVersion 47.1.43',
        '--fml.mcVersion 1.20.1',
        '--fml.forgeGroup net.minecraftforge',
        '--fml.mcpVersion 20230612.114412'
    ];

    /*const args = [
        javaPath,
        `-Xmx${maxRam}M`,
        '-XX:-UseAdaptiveSizePolicy',
        `-Xms${minRam}M`,
        '-XX:+IgnoreUnrecognizedVMOptions',
        jvmOptions.trim(),
        '-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump',
        `-Djava.library.path=${nativesDir}`,
        '-Dminecraft.launcher.brand=ArkaGameLauncher',
        '-Dminecraft.launcher.version=1.0.0',
        '-cp',
        libs,
        '-Djava.net.preferIPv6Addresses=system',
        '"-DignoreList=bootstraplauncher,securejarhandler,asm-commons,asm-util,asm-analysis,asm-tree,asm,JarJarFileSystems,client-extra,fmlcore,javafmllanguage,lowcodelanguage,mclanguage,forge-,1.20.1-forge-47.1.43.jar"',
        '-DmergeModules=jna-5.10.0.jar,jna-platform-5.10.0.jar',
        '-DlibraryDirectory=%libs%',
        '-p',
        '%libs%/cpw/mods/bootstraplauncher/1.1.2/bootstraplauncher-1.1.2.jar;%libs%/cpw/mods/securejarhandler/2.1.10/securejarhandler-2.1.10.jar;%libs%/org/ow2/asm/asm-commons/9.5/asm-commons-9.5.jar;%libs%/org/ow2/asm/asm-util/9.5/asm-util-9.5.jar;%libs%/org/ow2/asm/asm-analysis/9.5/asm-analysis-9.5.jar;%libs%/org/ow2/asm/asm-tree/9.5/asm-tree-9.5.jar;%libs%/org/ow2/asm/asm/9.5/asm-9.5.jar;%libs%/net/minecraftforge/JarJarFileSystems/0.3.19/JarJarFileSystems-0.3.19.jar',
        '--add-modules ALL-MODULE-PATH --add-opens java.base/java.util.jar=cpw.mods.securejarhandler',
        '--add-opens java.base/java.lang.invoke=cpw.mods.securejarhandler --add-exports java.base/sun.security.util=cpw.mods.securejarhandler',
        '--add-exports jdk.naming.dns/com.sun.jndi.dns=java.naming',
        '--launchTarget forgeclient --fml.forgeVersion 47.1.43 --fml.mcVersion 1.20.1 --fml.forgeGroup net.minecraftforge --fml.mcpVersion 20230612.114412',
        '--username',
        playerName,
        '--version 1.20.1',
        '--gameDir',
        getFileOrFolderPath(),
        '--assetsDir',
        assetsDir,
        '--assetIndex 5',
        '--uuid',
        playerUuid,
        '--accessToken',
        accessToken,
        '--width',
        width,
        '--height',
        height,
        'cpw.mods.bootstraplauncher.BootstrapLauncher'
    ];*/

    const finalOutput = args.join(' ').replaceAll('%libs%', libsDir);
    console.log(finalOutput);

    return finalOutput;
}

const Events = {
    UpdateStateChange: 'updateStateChange',
    GameClosed: 'gameClosed'
};