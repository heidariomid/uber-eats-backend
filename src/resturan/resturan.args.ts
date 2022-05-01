import {
  ArgsType,
  Field,
  InputType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { Resturan } from './resturan.entity';

@InputType()
export class createResturanArgs extends OmitType(Resturan, ['id'], InputType) {}

@InputType()
class updateResturanInputType extends PartialType(createResturanArgs) {}

@ArgsType()
export class updateResturanArgsType {
  @Field(() => Number)
  id: number;
  @Field(() => updateResturanInputType)
  data: updateResturanInputType;
}
