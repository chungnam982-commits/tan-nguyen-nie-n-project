export type PixelArea = { x: number; y: number; width: number; height: number };

/** Crops the source image to the given area and returns a 3:4 JPEG data URL. */
export async function cropToDataUrl(src: string, area: PixelArea, outW = 600, outH = 800) {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, outW, outH);
  return canvas.toDataURL("image/jpeg", 0.85);
}
