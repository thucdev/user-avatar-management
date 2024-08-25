import { UsersService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { MockDataService } from '@shared/services/mock-data.service';
import * as fs from 'fs';
import * as path from 'path';
import { getBase64Image, hashImage } from 'src/utils/utils.service';
import { AvatarRepository } from './avatar.repository';

@Injectable()
export class AvatarsService {
  constructor(
    private avatarsRepository: AvatarRepository,
    private mockDataService: MockDataService,
    private userService: UsersService,
  ) {}

  async getUserAvatar(userId: string): Promise<string> {
    const user = await this.userService.userAvatarInfo(userId);

    if (user.avatar) {
      return getBase64Image(user.avatar.filePath);
    }

    const userResponse = await this.mockDataService.request(
      'get',
      `/users/${user.externalId}`,
    );
    const avatarUrl = userResponse.data.avatar;

    const avatarPath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      `${user.id}.jpg`,
    );

    try {
      const avatarResponse = await this.mockDataService.streamImg(avatarUrl);

      const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // Use a promise to wait for the stream to finish writing the file
      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(avatarPath);
        avatarResponse.data.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const hash = hashImage(fs.readFileSync(avatarPath));

      const payload = {
        user: { id: userId },
        imageHash: hash,
        filePath: avatarPath,
      };
      await this.avatarsRepository.save(payload);

      return fs.readFileSync(avatarPath).toString('base64');
    } catch (error) {
      console.error(`Error processing avatar for user ${userId}:`, error);
      throw error;
    }
  }

  async deleteAvatar(userId: string): Promise<boolean> {
    const avatar = await this.avatarsRepository.findOne({
      where: { user: { id: userId } },
    });

    if (avatar) {
      fs.unlinkSync(avatar.filePath);
      await this.avatarsRepository.remove(avatar);
    }
    return true;
  }
}
