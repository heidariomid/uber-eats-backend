import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createResturanArgs, updateResturanArgsType } from './resturan.args';
import { Resturan } from './resturan.entity';

@Injectable()
export class ResturanService {
  constructor(
    @InjectRepository(Resturan) private readonly resturan: Repository<Resturan>,
  ) {}
  getAllResturan(): Promise<Resturan[]> {
    return this.resturan.find();
  }
  createResuran(args: createResturanArgs): Promise<Resturan> {
    const newResturan = this.resturan.create(args);
    return this.resturan.save(newResturan);
  }
  async updateResuran(args: updateResturanArgsType): Promise<boolean> {
    const updated = await this.resturan.update(args.id, { ...args.data });
    if (updated.affected > 0) {
      return true;
    }
    return false;
  }
}
