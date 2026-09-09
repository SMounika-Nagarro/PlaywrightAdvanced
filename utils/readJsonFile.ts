import fs from 'fs';

export function readJsonFile(filePath: string): any {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
}