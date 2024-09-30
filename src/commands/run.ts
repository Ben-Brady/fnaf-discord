import { createGame, tick, TICKS_PER_SECOND } from "../logic";
import { type GameplayInput, type GameplayState, type GameState } from "../logic/state";
import { getImage, render } from "../render";
import { range } from "lodash";
import { runBot, createCommand } from "discopic";
import type { CommandContext } from "discopic";
import { ActionRowBuilder, CommandInteraction } from "discord.js";
import {
  type MessageActionRowComponentBuilder,
  ButtonInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { preloadImages, getImageLink } from "../image-cache";
import { MAX_POWER, NIGHT_DURATION } from "../logic";

type MessageActionRow = ActionRowBuilder<MessageActionRowComponentBuilder>;
type UpdateCallback = (
  interaction: ButtonInteraction | StringSelectMenuInteraction | undefined,
  input: GameplayInput,
) => Promise<void>;

const formatPower = (power: number) => {
  const percent = Math.ceil((1 - power / MAX_POWER) * 100);
  return `${percent.toFixed()}%`;
};

const formatTime = (time: number) => {
  const hour = Math.floor((time / NIGHT_DURATION) * 6).toFixed();
  if (hour === "0") return "12PM";
  return `${hour}AM`;
};

const chars = (char: string, count: number) =>
  range(count)
    .map(() => char)
    .join("");

const formatPowerBar = (state: GameplayState) => {
  let powerUsage = 1;
  if (state.left_door) powerUsage += 1;
  if (state.right_door) powerUsage += 1;
  if (state.view === "camera") powerUsage += 1;
  if (state.left_light || state.right_light) powerUsage += 1;

  return chars("x", powerUsage) + chars("-", 4 - powerUsage);
};

export const runGame = async (
  state: GameState,
  interaction: CommandInteraction,
  ctx: CommandContext,
  isPrivate: boolean = false,
) => {
  let lastUpdate = Date.now();
  const TIME_BETWEEN_UPDATES = 1500;
  let hasReachedPowerout = false;

  const update = async (
    secondInteraction: ButtonInteraction | StringSelectMenuInteraction | undefined = undefined,
    input: GameplayInput = undefined,
  ) => {
    state = tick(state, input);

    const msSinceUpdate = Date.now() - lastUpdate;
    lastUpdate = Date.now();

    const secondsSinceUpdate = msSinceUpdate / 1000;
    const ticks = Math.round(secondsSinceUpdate * TICKS_PER_SECOND) - 1;
    range(ticks).map(() => (state = tick(state, undefined)));

    const image = render(state);
    const imageLink = getImageLink(image);

    if (state.type === "jumpscare" || state.type === "victory") {
      await interaction.editReply({ content: imageLink, components: [] });
      clearInterval(interval);
      return;
    }

    if (state.type === "powerout") {
      if (!hasReachedPowerout) {
        clearInterval(interval);
        interval = setInterval(intervalCallback, 500);
        hasReachedPowerout = true;
      }

      await interaction.editReply({ content: imageLink, components: [] });
      return;
    }

    const rows =
      state.view === "office" ?
        createOfficeButton(ctx, update)
      : createCameraButtons(ctx, update, state);

    const power_percent = formatPower(state.power);
    const hour = formatTime(state.time);
    const power_bar = formatPowerBar(state);
    const content = `\`${hour} | ${power_percent} | ${power_bar}\`\n` + imageLink;

    if (secondInteraction) {
      await secondInteraction.update({
        content: content,
        components: rows,
      });
    } else {
      await interaction.editReply({
        content: content,
        components: rows,
      });
    }
  };

  await interaction.reply({ content: "Loading...", ephemeral: isPrivate });
  await preloadImages(interaction.client);

  const intervalCallback = async () => {
    const msSinceUpdate = Date.now() - lastUpdate;

    let currentImage = render(state);

    let newState = state;
    const secondsSinceUpdate = msSinceUpdate / 1000;
    const ticks = Math.round(secondsSinceUpdate * TICKS_PER_SECOND) - 1;
    range(ticks).map(() => (newState = tick(newState, undefined)));

    let nextImage = render(newState);
    if (currentImage === nextImage && msSinceUpdate < TIME_BETWEEN_UPDATES) return;

    try {
      await update();
    } catch {
      clearInterval(interval);
    }
  };

  await update();
  let interval = setInterval(intervalCallback, TIME_BETWEEN_UPDATES);
};

const createOfficeButton = (ctx: CommandContext, update: UpdateCallback): MessageActionRow[] => {
  const leftDoorButton = ctx.createButton({
    title: "Left Door",
    type: "primary",
    callback: async ({ interaction }) => {
      await update(interaction, { type: "left-door" });
    },
  });

  const leftLightButton = ctx.createButton({
    title: "Left Light",
    type: "secondary",
    callback: async ({ interaction }) => {
      await update(interaction, { type: "left-light" });
    },
  });

  const openCameraButon = ctx.createButton({
    title: "Open Camera",
    type: "danger",
    callback: async ({ interaction }) => {
      await update(interaction, { type: "open-camera" });
    },
  });

  const rightLightButton = ctx.createButton({
    title: "Right Light",
    type: "secondary",
    callback: async ({ interaction }) => {
      await update(interaction, { type: "right-light" });
    },
  });

  const rightDoorButton = ctx.createButton({
    title: "Right Door",
    type: "primary",
    callback: async ({ interaction }) => {
      await update(interaction, { type: "right-door" });
    },
  });

  const components = [
    leftDoorButton,
    leftLightButton,
    openCameraButon,
    rightLightButton,
    rightDoorButton,
  ];
  return [new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(components)];
};

const createCameraButtons = (
  ctx: CommandContext,
  update: UpdateCallback,
  state: GameplayState,
): MessageActionRow[] => {
  const closeCamera = ctx.createButton({
    title: "Close Camera",
    type: "primary",
    callback: async ({ interaction }) => {
      await update(interaction, { type: "close-camera" });
    },
  });

  const cameraNameLookup = {
    "1a": "1a - Stage",
    "1b": "1b - Tables",
    "1c": "1c - Pirate Cove",
    "2a": "2a - Left Hallway",
    "2b": "2b - Left Door",
    "3": "3 - Broom Closet",
    "4a": "4a - Right Hallway",
    "4b": "4b - Right Door",
    "5": "5 - Backroom",
    "6": "6 - Kitchen",
    "7": "7 - Bathroom",
  } as const;
  const cameraDropdown = ctx.createStringSelection({
    options: [
      { label: "1a - Stage", value: "1a" },
      { label: "1b - Tables", value: "1b" },
      { label: "1c - Pirate Cove", value: "1c" },
      { label: "2a - Left Hallway", value: "2a" },
      { label: "2b - Left Door", value: "2b" },
      { label: "3 - Broom Closet", value: "3" },
      { label: "4a - Right Hallway", value: "4a" },
      { label: "4b - Right Door", value: "4b" },
      { label: "5 - Backroom", value: "5" },
      { label: "6 - Kitchen", value: "6" },
      { label: "7 - Bathroom", value: "7" },
    ],
    default: cameraNameLookup[state.camera.location],
    onSelect: async ({ interaction, selected }) => {
      const camera = selected[0];
      await update(interaction, { type: "swap-camera", camera });
    },
  });

  return [
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([closeCamera]),
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([cameraDropdown]),
  ];
};
