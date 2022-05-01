import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class coreArgs {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Boolean)
  ok: boolean;
}
