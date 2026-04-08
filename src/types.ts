export interface BoxModelConfig {
  paddingTop?: number;
  paddingBottom?: number;
  borderTop?: number;
  borderBottom?: number;
  marginBottom?: number;
}

export interface VirtualItemData {
  id: string | number;
  text: string;
}

export interface MeasurementCache {
  [id: string]: number;
}
