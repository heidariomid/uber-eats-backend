import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createResturanArgs, updateResturanArgsType } from './resturan.args';
import { Resturan } from './resturan.entity';
import { ResturanService } from './resturan.service';

@Resolver()
export class ResturanResolver {
  //init
  constructor(private readonly resturanService: ResturanService) {}

  // get all resturan
  @Query(() => [Resturan])
  async getAllResturan(): Promise<Resturan[]> {
    return await this.resturanService.getAllResturan();
  }
  // create resturan
  @Mutation(() => Resturan)
  async createResturan(
    @Args('data') args: createResturanArgs,
  ): Promise<Resturan> {
    return await this.resturanService.createResuran(args);
  }
  // update resturan
  @Mutation(() => Boolean)
  async updateResturan(@Args() args: updateResturanArgsType) {
    return await this.resturanService.updateResuran(args);
  }
}
