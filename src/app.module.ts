import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/users.entity';
import { CommonModule } from './common/core.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { UsersValidation } from './users/entities/usersValidation.entity';
import { MailModule } from './mail/mail.module';
import { Category } from './restaurant/entities/category.entity';
import { Dish } from './restaurant/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/orders.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'prod').required(),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MAIL_API_KEY: Joi.string().required(),
        MAIL_DOMAIN_NAME: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: async ({ req }) => ({ user: req['user'] }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCEMA,
      logging: false,
      synchronize: process.env.NODE_ENV !== 'prod',
      entities: [Restaurant, User, UsersValidation, Category, Dish, Order],
    }),
    RestaurantModule,
    UsersModule,
    CommonModule,
    OrdersModule,
    AuthModule,
    JwtModule.forRoot({ JWT_SECRET: process.env.JWT_SECRET }),
    MailModule.forRoot({
      MAIL_API_KEY: process.env.MAIL_API_KEY,
      MAIL_DOMAIN_NAME: process.env.MAIL_DOMAIN_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
