export interface BlobCharacteristic {
    gravity: number;
    shapeStiffness: number;
    edgeStiffness: number;
    wallBounce: number;
    mouseStiffness: number;
    jellyTexture: JellyTexture;
    jellyShape: JellyShape;
    contourDots: number;
    radius: number;
    backgroundImage: string | null;
}


enum JellyShape {
    CIRCLE,
}


interface ColorStop {
    stop: number;
    color: string;
}

interface GradientTexture {
    type: "gradient";
    colorStops: ColorStop[];
}

interface PatternTexture {
    type: "pattern";
    imageUrl: string;
    repetition?: string;
}

interface ImageTexture {
    type: "image";
    imageUrl: string;
}

type JellyTexture =
    | GradientTexture
    | PatternTexture
    | ImageTexture;