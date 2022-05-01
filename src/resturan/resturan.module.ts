import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resturan } from './resturan.entity';
import { ResturanResolver } from './resturan.resolver';
import { ResturanService } from './resturan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resturan])],
  providers: [ResturanResolver, ResturanService],
})
export class ResturanModule {}
