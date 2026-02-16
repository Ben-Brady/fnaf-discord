import { getImage, type Image, imageNames } from "./render/files";
import { Client, type TextChannel } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import { chunk, zip } from "lodash";

let imagesUrls: Partial<Record<Image, string>> = {};

export const preloadImages = async (client: Client) => {
  let channel = await client.channels.fetch("1290371834390380635");
  if (!channel) throw new Error("Invalid cache channel provided");
  if (!channel.isTextBased()) throw new Error("Invalid cache channel provided");
  channel = channel as TextChannel;

  try {
    const cache = await readFile(".image-cache", { encoding: "utf-8" });
    imagesUrls = JSON.parse(cache);
    return;
  } catch {}

  const uncachedImages = imageNames.filter((name) => !(name in imagesUrls));
  for (const names of chunk(uncachedImages, 5)) {
    const files = names.map(getImage);
    const message = await channel.send({ files });

    const attachments = Array.from(message.attachments).map(([_, attachment]) => attachment);

    zip(names, attachments).map(([name, attachment]) => {
      if (!name || !attachment) return;
      imagesUrls[name] = attachment.url;
    });
  }

  await writeFile(".image-cache", JSON.stringify(imagesUrls), { encoding: "utf-8" });
};

export const getImageUrl = (image: Image): string => {
  const link = imagesUrls[image];

  if (!link) throw new Error(`'${image}' not found`);
  return link;
};

export const getImageUrls = (): string[] => {
  return Object.values(imagesUrls);
};
