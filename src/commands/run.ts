import { createGame, tick, TICKS_PER_SECOND } from "../logic";
import {
  type CameraName,
  type GameplayInput,
  type GameplayState,
  type GameState,
} from "../logic/state";
import { render } from "../render";
import { range } from "lodash";
import { createButton, createStringSelect } from "discopic";
import { ActionRowBuilder, CommandInteraction, MessageFlags } from "discord.js";
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
  input: GameplayInput
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
  isPrivate: boolean = false
) => {
  let lastUpdate = Date.now();
  let maxTimeBetweenUpdates = 5000;
  let hasReachedPowerout = false;

  const update = async (
    secondInteraction: ButtonInteraction | StringSelectMenuInteraction | undefined = undefined,
    input: GameplayInput = undefined
  ) => {
    state = tick(state, input);
    lastUpdate = Date.now();
    const image = render(state);
    lastImage = image;
    const imageLink = getImageLink(image);

    if (state.type === "jumpscare" || state.type === "victory") {
      await interaction.editReply({ content: imageLink, components: [] });
      return;
    }

    if (state.type === "powerout") {
      if (!hasReachedPowerout) {
        maxTimeBetweenUpdates = 500;
        hasReachedPowerout = true;
      }

      await interaction.editReply({ content: imageLink, components: [] });
      return;
    }

    const rows =
      state.view === "office"
        ? createOfficeButton(interaction, update)
        : createCameraButtons(interaction, update, state);

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

  await interaction.reply({
    content: "Loading...",
    flags: isPrivate ? MessageFlags.Ephemeral : undefined,
  });
  await preloadImages(interaction.client);

  let lastImage = render(state);
  const checkForRender = async () => {
    const msSinceUpdate = Date.now() - lastUpdate;

    let currentImage = render(state);

    if (currentImage === lastImage && msSinceUpdate < maxTimeBetweenUpdates) return;

    try {
      await update();
    } catch {
      clearInterval(renderInterval);
    }

    if (state.type === "victory" || state.type === "jumpscare") {
      clearInterval(renderInterval);
    }
  };

  await update();
  let renderInterval = setInterval(checkForRender, 50);
  let updateInterval = setInterval(() => {
    state = tick(state, undefined);
    if (state.type === "jumpscare" || state.type === "victory") {
      clearInterval(updateInterval);
    }
  }, (1000 / TICKS_PER_SECOND) * 2);
};

const createOfficeButton = (
  interaction: CommandInteraction,
  update: UpdateCallback
): MessageActionRow[] => {
  const leftDoorButton = createButton(interaction.client, {
    title: "Left Door",
    type: "primary",
    onClick: async (interaction) => {
      await update(interaction, { type: "left-door" });
    },
  });

  const leftLightButton = createButton(interaction.client, {
    title: "Left Light",
    type: "secondary",
    onClick: async (interaction) => {
      await update(interaction, { type: "left-light" });
    },
  });

  const openCameraButon = createButton(interaction.client, {
    title: "Open Camera",
    type: "danger",
    onClick: async (interaction) => {
      await update(interaction, { type: "open-camera" });
    },
  });

  const rightLightButton = createButton(interaction.client, {
    title: "Right Light",
    type: "secondary",
    onClick: async (interaction) => {
      await update(interaction, { type: "right-light" });
    },
  });

  const rightDoorButton = createButton(interaction.client, {
    title: "Right Door",
    type: "primary",
    onClick: async (interaction) => {
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
  interaction: CommandInteraction,
  update: UpdateCallback,
  state: GameplayState
): MessageActionRow[] => {
  const closeCamera = createButton(interaction.client, {
    title: "Close Camera",
    type: "primary",
    onClick: async (interaction) => {
      await update(interaction, { type: "close-camera" });
    },
  });

  const cameraDropdown = createStringSelect(interaction.client, {
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
    defaultValue: state.camera.location,
    onSelect: async (interaction) => {
      const camera = interaction.values[0] as CameraName;
      await update(interaction, { type: "swap-camera", camera });
    },
  });

  return [
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([closeCamera]),
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([cameraDropdown]),
  ];
};
