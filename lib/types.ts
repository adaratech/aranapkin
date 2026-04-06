export interface NapkinAnalysis {
  dominantW: string;
  diagramType: string;
  sqvid: string[];
}

export interface NapkinResult {
  analysis: NapkinAnalysis;
  canvas: {
    width: number;
    height: number;
  };
  drawingCode: string;
}
