import { createCommand, attachSlashCommands } from "discopic";
import { Client } from "discord.js";
import { runGame } from "./commands/run";
import { createGame } from "./logic";
import { createNight } from "./logic/game";

const client = new Client({ intents: ["Guilds", "GuildMessages", "GuildMembers"] });

const gameCommand = createCommand({
  name: "custom",
  description: "Creates a fnaf game",
  parameters: {
    private: {
      type: "boolean",
      description: "Is this a private game",
      optional: true,
    },
    chica: {
      type: "integer",
      description: "Chica's AI Level",
      min: 0,
      max: 20,
      optional: true,
    },
    bonnie: {
      type: "integer",
      description: "Bonnies's AI Level",
      min: 0,
      max: 20,
      optional: true,
    },
    foxy: {
      type: "integer",
      description: "Foxy's AI Level",
      min: 0,
      max: 20,
      optional: true,
    },
    freddy: {
      type: "integer",
      description: "Freddy's AI Level",
      min: 0,
      max: 20,
      optional: true,
    },
  },
  async execute(
    interaction,
    { bonnie = 0, chica = 0, foxy = 0, freddy = 0, private: isPrivate = false }
  ) {
    let state = createGame({ bonnie, chica, foxy, freddy });
    runGame(state, interaction, isPrivate);
  },
});

const nightCommand = createCommand({
  name: "night",
  description: "Play a fnaf night",
  parameters: {
    night: {
      type: "integer",
      description: "The night to play",
      min: 1,
      max: 6,
    },
    private: {
      type: "boolean",
      description: "Is this a private game",
      optional: true,
    },
  },
  async execute(interaction, { night, private: isPrivate = false }) {
    let state = createNight(night);
    runGame(state, interaction, isPrivate);
  },
});

attachSlashCommands(client, {
  commands: [gameCommand, nightCommand],
});

client.login(process.env.TOKEN);
