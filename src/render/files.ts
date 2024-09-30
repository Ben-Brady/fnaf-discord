import { existsSync } from "fs";

const images = {
  "cam-static": "./images/static.webp",

  victory: "./images/victory.gif",

  // Powerout
  powerout: "./images/powerout/powerout.webp",
  "powerout-freddy": "./images/powerout/powerout-freddy.gif",

  // Jumpscares
  "jumpscare-foxy": "./images/jumpscare/foxy.gif",
  "jumpscare-bonnie": "./images/jumpscare/bonnie.gif",
  "jumpscare-chica": "./images/jumpscare/chica.gif",
  "jumpscare-freddy-powerout": "./images/jumpscare/freddy-powerout.gif",
  "jumpscare-freddy-office": "./images/jumpscare/freddy-office.gif",

  // Camera 1a
  "cam-1a-b-c-f": "./images/1a/1a-b-c-f.webp",
  "cam-1a-b-f": "./images/1a/1a-b-f.webp",
  "cam-1a-c-f": "./images/1a/1a-c-f.webp",
  "cam-1a-f": "./images/1a/1a-f.webp",
  "cam-1a": "./images/1a/1a.webp",

  // Camera 1b
  "cam-1b-b-c-f": "./images/1b/1b-b-c-f.webp",
  "cam-1b-b-c": "./images/1b/1b-b-c.webp",
  "cam-1b-b-f": "./images/1b/1b-b-f.webp",
  "cam-1b-b": "./images/1b/1b-b.webp",
  "cam-1b-c-f": "./images/1b/1b-c-f.webp",
  "cam-1b-c": "./images/1b/1b-c.webp",
  "cam-1b-f": "./images/1b/1b-f.webp",
  "cam-1b": "./images/1b/1b.webp",

  // Camera 1c
  "cam-1c-0": "./images/1c/1c-0.webp",
  "cam-1c-1": "./images/1c/1c-1.webp",
  "cam-1c-2": "./images/1c/1c-2.webp",
  "cam-1c-3": "./images/1c/1c-3.webp",

  // Camera 2a
  "cam-2a": "./images/2a/2a.webp",
  "cam-2a-f": "./images/2a/2a-f.webp",
  "cam-2a-b": "./images/2a/2a-b.webp",

  // Camera 2b
  "cam-2b": "./images/2b/2b.webp",
  "cam-2b-b": "./images/2b/2b-b.webp",

  // Camera 3
  "cam-3": "./images/3/3.webp",
  "cam-3-b": "./images/3/3-b.webp",

  // Camera 4a
  "cam-4a": "./images/4a/4a.webp",
  "cam-4a-c": "./images/4a/4a-c.webp",
  "cam-4a-f": "./images/4a/4a-f.webp",
  "cam-4a-c-f": "./images/4a/4a-c-f.webp",

  // Camera 4b
  "cam-4b": "./images/4b/4b.webp",
  "cam-4b-c": "./images/4b/4b-c.webp",
  "cam-4b-f": "./images/4b/4b-f.webp",

  // Camera 5
  "cam-5": "./images/5/5.webp",
  "cam-5-b-door": "./images/5/5-b-door.webp",
  "cam-5-b-camera": "./images/5/5-b-camera.webp",

  // Camera 7
  "cam-7": "./images/7/7.webp",
  "cam-7-c": "./images/7/7-c.webp",
  "cam-7-f": "./images/7/7-f.webp",
  "cam-7-c-f": "./images/7/7-c-f.webp",

  office: "./images/office/office.webp",
  "office-ld": "./images/office/office-ld.webp",
  "office-rd": "./images/office/office-rd.webp",
  "office-ld-rd": "./images/office/office-ld-rd.webp",
  "office-ll": "./images/office/office-ll.webp",
  "office-ll-rd": "./images/office/office-ll-rd.webp",
  "office-ll-ld": "./images/office/office-ll-ld.webp",
  "office-ll-ld-rd": "./images/office/office-ll-ld-rd.webp",
  "office-ll-bonnie": "./images/office/office-ll-bonnie.webp",
  "office-ll-rd-bonnie": "./images/office/office-ll-rd-bonnie.webp",
  "office-ll-ld-bonnie": "./images/office/office-ll-ld-bonnie.webp",
  "office-ll-ld-rd-bonnie": "./images/office/office-ll-ld-rd-bonnie.webp",
  "office-rl": "./images/office/office-rl.webp",
  "office-rl-rd": "./images/office/office-rl-rd.webp",
  "office-rl-ld": "./images/office/office-rl-ld.webp",
  "office-rl-ld-rd": "./images/office/office-rl-ld-rd.webp",
  "office-rl-chica": "./images/office/office-rl-chica.webp",
  "office-rl-rd-chica": "./images/office/office-rl-rd-chica.webp",
  "office-rl-ld-chica": "./images/office/office-rl-ld-chica.webp",
  "office-rl-ld-rd-chica": "./images/office/office-rl-ld-rd-chica.webp",
} as const;

export type Image = keyof typeof images;
export const imageNames = Object.entries(images).map(([key]) => key) as Image[];
export const getImage = (image: Image): string => images[image];

const verifyImagesValid = () => {
  const invalidImages = [...Object.entries(images)].filter(
    ([_, filename]) => !existsSync(filename),
  );
  if (invalidImages.length > 0) {
    throw new Error("Missing Images:\n" + invalidImages.join("\n"));
  }
};

verifyImagesValid();
