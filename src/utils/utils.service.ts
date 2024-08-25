import * as crypto from 'crypto';
import * as fs from 'fs';

export class UtilsService {
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: Record<string, any>,
  ): T;
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: Record<string, any>,
  ): T[];
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E | E[],
    options: Record<string, any>,
  ): T | T[] {
    if (Array.isArray(entity)) {
      return entity.map((u) => new model(u, options));
    }

    return new model(entity, options);
  }
}

export function splitObjectNameToString(name: string): string {
  let result = '';
  let index: number, char: string;
  for ([index, char] of name.split('').entries()) {
    const upperCase = char.toUpperCase();
    if ((upperCase === char || Number(char)) && index > 0) {
      result += ' ';
      char = char.toLowerCase();
    }
    result += char;
  }

  return result;
}

export function getBase64Image(filePath: string): string {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString('base64');
}

export function hashImage(imageBuffer: Buffer): string {
  return crypto.createHash('sha256').update(imageBuffer).digest('hex');
}
