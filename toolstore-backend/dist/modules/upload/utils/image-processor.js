"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processProductImage = processProductImage;
const sharp = require('sharp');
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
async function processProductImage(buffer, filename, uploadDir, productId) {
    const baseName = path.parse(filename).name;
    const outputDir = path.join(uploadDir, 'products', productId);
    await fs.mkdir(outputDir, { recursive: true });
    const sizes = {
        thumbnail: 300,
        medium: 800,
        original: 1600,
    };
    const results = {};
    for (const [key, width] of Object.entries(sizes)) {
        const outputFilename = `${baseName}-${key}.webp`;
        const outputPath = path.join(outputDir, outputFilename);
        await sharp(buffer)
            .resize(width, width, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(outputPath);
        results[key] = `/uploads/products/${productId}/${outputFilename}`;
    }
    results['filename'] = baseName + '.webp';
    results['originalName'] = filename;
    results['path'] = `/uploads/products/${productId}/`;
    return results;
}
//# sourceMappingURL=image-processor.js.map