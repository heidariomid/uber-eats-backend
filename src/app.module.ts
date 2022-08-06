import { Module } from '@nestjs/common';
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
import { UsersValidation } from './users/entities/usersValidation.entity';
import { MailModule } from './mail/mail.module';
import { Category } from './restaurant/entities/category.entity';
import { Dish } from './restaurant/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/orders.entity';
import { OrderItem } from './orders/entities/orderItem.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payments.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'production').required(),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USER: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        JWT_SECRET: Joi.string().required(),
        MAIL_API_KEY: Joi.string().required(),
        MAIL_DOMAIN_NAME: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      introspection: true,
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect({ Authorization }) {
            if (Authorization) {
              return { token: Authorization };
            }
            throw new Error('Missing auth token!');
          },
        },
        'graphql-ws': true,
      },
      context: ({ req }) => req && { token: req.headers.authorization },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          }),
      schema: process.env.DB_SCHEMA,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
      // synchronize: process.env.NODE_ENV !== 'production',
      entities: [
        Restaurant,
        User,
        UsersValidation,
        Category,
        Dish,
        Order,
        OrderItem,
        Payment,
      ],
    }),
    RestaurantModule,
    UsersModule,
    CommonModule,
    OrdersModule,
    AuthModule,
    CommonModule,
    JwtModule.forRoot({ JWT_SECRET: process.env.JWT_SECRET }),
    MailModule.forRoot({
      MAIL_API_KEY: process.env.MAIL_API_KEY,
      MAIL_DOMAIN_NAME: process.env.MAIL_DOMAIN_NAME,
    }),
    PaymentsModule,
    ScheduleModule.forRoot(),
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
