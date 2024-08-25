import { UserEntity } from '@entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from '@shared/services/email.service';
import { MockDataService } from '@shared/services/mock-data.service';
import { IUserDetailResponse } from './interface/IUserDetailResponse';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private mockDataService: MockDataService,
    private mailService: MailService,
  ) {}

  async create(): Promise<string[]> {
    const response = await this.mockDataService.request('get', '/users');

    const result = [];
    for (const item of response.data) {
      const existingUser = await this.userRepository.findOne({
        where: { email: item.email },
      });
      if (!existingUser) {
        const user = this.userRepository.create({
          email: item.email,
          firstName: item.first_name,
          lastName: item.last_name,
          externalId: item.id,
          avatar: item.avatar,
        });
        const savedUser = await this.userRepository.save(user);

        result.push(savedUser);
      } else {
        result.push(existingUser);
      }
    }

    // await this.mailService.sendDummyEmail('title', 'dummny content', 'admin@gmail.com' );

    return result;
  }

  async detail(userId: string): Promise<IUserDetailResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const response = await this.mockDataService.request(
      'get',
      `/users/${user.externalId}`,
    );

    const res = {
      id: user.id,
      externalId: user.externalId,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      email: response.data.email,
      avatar: response.data.avatar,
    };
    return res;
  }

  async userAvatarInfo(userId: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['avatar'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.log('error', error);
    }
  }
}
