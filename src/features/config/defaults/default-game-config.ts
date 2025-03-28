export type DefaultGameConfig = {
  game: string;
  version: {
    installed: string;
  };
};

export type DefaultCobblemonUserSettings = {
  user: {
    ram: number;
    mods: [];
  };
};

const defaultGameConfig = {
  game: 'cobblemon',
  version: {
    installed: '0.0.0',
  },
  user: {
    ram: 4096,
    mods: [],
  },
} as DefaultGameConfig & DefaultCobblemonUserSettings;

export default defaultGameConfig;
