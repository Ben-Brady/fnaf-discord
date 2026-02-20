import {
  runTick,
  getHour,
  type CameraName,
  type GameplayInput,
  type GameplayState,
  type GameState,
} from "@nnilky/fnaf.js";
import { render } from "../render";
import { preloadImages, getImageUrl, getImageUrls } from "../image-cache";
import { range } from "lodash";
import { createButton, createStringSelect } from "discopic";
import {
  type MessageActionRowComponentBuilder,
  ButtonInteraction,
  StringSelectMenuInteraction,
  ActionRowBuilder,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import { sleep } from "bun";

type MessageActionRow = ActionRowBuilder<MessageActionRowComponentBuilder>;
type UpdateCallback = (
  interaction: ButtonInteraction | StringSelectMenuInteraction | undefined,
  input: GameplayInput,
) => Promise<void>;

const formatPower = (power: number) => `${power.toFixed()}%`;
const formatTime = (time: number) => getHour(time);

const repeat = (char: string, count: number) =>
  range(count)
    .map(() => char)
    .join("");

const formatPowerBar = (state: GameplayState) => {
  let powerUsage = 1;
  if (state.left_door) powerUsage += 1;
  if (state.right_door) powerUsage += 1;
  if (state.view === "camera") powerUsage += 1;
  if (state.left_light || state.right_light) powerUsage += 1;

  return repeat("x", powerUsage) + repeat("-", 4 - powerUsage);
};

export const runGame = async (
  state: GameState,
  interaction: CommandInteraction,
  isPrivate: boolean = false,
) => {
  let lastUpdate = Date.now();
  let maxTimeBetweenUpdates = 2500;
  let hasReachedPowerout = false;

  const update = async (
    userInteraction: ButtonInteraction | StringSelectMenuInteraction | undefined = undefined,
    input: GameplayInput = undefined,
  ) => {
    state = runTick(state, input, 0);
    lastUpdate = Date.now();
    const image = render(state);
    lastImage = image;
    const imageLink = getImageUrl(image);

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

    const officeButtons = createOfficeButtons(interaction, update);
    const cameraButtons = createCameraButtons(interaction, update, state);
    const rows = state.view === "office" ? officeButtons : cameraButtons;

    const power_percent = formatPower(state.power);
    const hour = formatTime(state.time);
    const power_bar = formatPowerBar(state);
    const content = `\`${hour} | ${power_percent} | ${power_bar}\`\n` + imageLink;

    if (userInteraction) {
      await userInteraction.update({
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
  const urls = getImageUrls();
  for (let i = 0; i < Math.ceil(urls.length / 4); i++) {
    const batch = urls.slice(i * 4, i * 4 + 4);
    await interaction.editReply({
      content: "Loading (Images)...\n" + batch.join("\n"),
      components: [],
    });
    await sleep(100);
  }

  let lastImage = render(state);
  const checkForRender = async () => {
    const msSinceUpdate = Date.now() - lastUpdate;

    let currentImage = render(state);
    if (currentImage === lastImage && msSinceUpdate < maxTimeBetweenUpdates) return;

    await update();
  };

  await update();
  let updateInterval = setInterval(() => {
    state = runTick(state, undefined, 0.0166);
    if (state.type === "jumpscare" || state.type === "victory") {
      clearInterval(updateInterval);
    }
    checkForRender();
  }, 33);
};

const createOfficeButtons = (
  interaction: CommandInteraction,
  update: UpdateCallback,
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
    type: "primary",
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
    openCameraButon,
    leftDoorButton,
    leftLightButton,
    rightLightButton,
    rightDoorButton,
  ];
  return [new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(components)];
};

const createCameraButtons = (
  interaction: CommandInteraction,
  update: UpdateCallback,
  state: GameplayState,
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
    defaultValue: state.camera,
    onSelect: async (interaction) => {
      const camera = interaction.values[0] as CameraName;
      await update(interaction, { type: "swap-camera", camera });
    },
  });

  return [
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([cameraDropdown]),
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([closeCamera]),
  ];
};
