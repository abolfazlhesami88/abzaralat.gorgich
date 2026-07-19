export interface ProcessedImage {
    original: string;
    thumbnail: string;
    medium: string;
    filename?: string;
    originalName?: string;
    path?: string;
}
export declare function processProductImage(buffer: Buffer, filename: string, uploadDir: string, productId: string): Promise<ProcessedImage>;
