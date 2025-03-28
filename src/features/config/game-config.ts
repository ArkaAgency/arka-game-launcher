import fs from 'fs';
import path from 'path';
import { getKeplerPath } from '../../main/util';
import defaultGameConfig, {
  DefaultCobblemonUserSettings,
  DefaultGameConfig,
} from './defaults/default-game-config';

export function getGameConfig(): DefaultGameConfig &
  DefaultCobblemonUserSettings {
  const keplerPath = getKeplerPath();
  if (!fs.existsSync(keplerPath)) fs.mkdirSync(keplerPath);

  const configPath = path.join(keplerPath, 'configs/');
  if (!fs.existsSync(configPath)) fs.mkdirSync(configPath);

  const gameConfigPath = path.join(configPath, 'cobblemon.config.json');
  if (!fs.existsSync(gameConfigPath)) {
    fs.writeFileSync(gameConfigPath, JSON.stringify(defaultGameConfig));
  }

  const gameConfig = fs.readFileSync(gameConfigPath).toString();
  return JSON.parse(gameConfig);
}

export function getGameName(): string {
  const gameConfig = getGameConfig();
  return gameConfig.game;
}

export function getGameVersion(): string {
  const gameConfig = getGameConfig();
  return gameConfig.version.installed;
}
