import * as pretext from "@chenglou/pretext";
import type { BoxModelConfig } from "./types";

export function calculateItemHeight(
  text: string,
  font: string,
  containerWidth: number,
  lineHeight: number,
  boxModel: BoxModelConfig = {},
): number {

  const prepared = pretext.prepare(text, font);


  const layout = pretext.layout(prepared, containerWidth, lineHeight);
  const rawTextHeight = layout.height;


  const pt = boxModel.paddingTop || 0;
  const pb = boxModel.paddingBottom || 0;
  const bt = boxModel.borderTop || 0;
  const bb = boxModel.borderBottom || 0;
  const mb = boxModel.marginBottom || 0;


  return rawTextHeight + pt + pb + bt + bb + mb;
}
