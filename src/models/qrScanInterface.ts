interface ResultPoint {
    x: number;
    y: number;
    estimatedModuleSize: number;
    count?: number;
}

interface RawBytes {
    [key: number]: number;
}

interface DataObject {
    vip: string;
    check: boolean;
}

interface IQrScanner {
    text: string;
    rawBytes: RawBytes;
    numBits: number;
    resultPoints: ResultPoint[];
    format: number;
    timestamp: number;
    resultMetadata: Record<string, unknown>;
    data: DataObject;
    url: string;
}

export type {IQrScanner}