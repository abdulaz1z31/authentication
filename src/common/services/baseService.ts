import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';

export class BaseService<CreateDto, Entity> {
  constructor(protected readonly repository: Repository<any>) {}

  get getRepository() {
    return this.repository;
  }

  async create(dto: CreateDto) {
    let created_data = this.repository.create({
      ...dto,
    }) as unknown as Entity;
    created_data = await this.repository.save(created_data);
    return {
      message: 'Created',
      statusCode: 201,
      data: created_data,
    };
  }

  async save(dto: CreateDto) {
    let created_data = this.repository.create({
      ...dto,
    }) as unknown as Entity;
    created_data = await this.repository.save(created_data);
    return created_data;
  }

  async findAll() {
    const data = (await this.repository.find()) as Entity[];
    return {
      message: 'Success',
      statusCode: 200,
      data: data,
    };
  }

  async findOneBy(options) {
    const data = (await this.repository.findOne({
      where: { ...options },
    })) as Entity;
    if (!data) {
      throw new HttpException('Not found', 404);
    }
    return {
      message: 'Success',
      statusCode: 200,
      data: data,
    };
  }

  async update(id: string, dto: Partial<CreateDto>) {
    await this.repository.update(id, {
      ...dto,
      updated_at: new Date(Date.now()),
    });
    const newData = await this.repository.findOneBy({ id });
    return {
      message: 'Updated',
      statusCode: 200,
      data: newData,
    };
  }

  async delete(id: string) {
    (await this.repository.delete(id)) as unknown as Entity;
    return {
      message: 'Deleted',
      statusCode: 200,
      data: { id },
    };
  }
}
