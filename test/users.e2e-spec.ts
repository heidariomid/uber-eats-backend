import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { UsersValidation } from 'src/users/entities/usersValidation.entity';
jest.mock('axios');
const GRAPHQL_ENDPOINT = '/graphql';
describe('Users (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let users: Repository<User>;
  let usersValidation: Repository<UsersValidation>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    users = module.get(getRepositoryToken(User));
    usersValidation = module.get(getRepositoryToken(UsersValidation));

    await app.init();
  });
  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });
  describe('createAccount', () => {
    it('should create a user', () => {
      try {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            operationName: null,
            variables: {
              data: {
                email: 'test@mock.com',
                password: '1234',
                role: 'Delivery',
              },
            },
            query: `mutation($data: createAccountInput!) {
              createAccount(data: $data) {
                ok
                message
              }
            }`,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createAccount.ok).toBe(true);
            expect(res.body.data.createAccount.message).toBe('Account created');
          });
      } catch (error) {
        console.log(error.message);
      }
    });
    it('should fail if account already exist', () => {
      try {
        return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            operationName: null,
            variables: {
              data: {
                email: 'test@mock.com',
                password: '1234',
                role: 'Delivery',
              },
            },
            query: `mutation($data: createAccountInput!) {
              createAccount(data: $data) {
                ok
                message
              }
            }`,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createAccount.ok).toBe(false);
            expect(res.body.data.createAccount.message).toEqual(
              'User already exist',
            );
          });
      } catch (error) {
        console.log(error.message);
      }
    });
  });
  describe('login', () => {
    it('should pass if email and password was correct', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          operationName: null,
          variables: {
            data: {
              email: 'test@mock.com',
              password: '1234',
            },
          },
          query: `mutation Login($data: loginInput!) {
              login(data: $data) {
                ok
                message
                token
              }
            }`,
        })

        .expect(200)
        .expect((res) => {
          expect(res.body.data.login.ok).toBe(true);
          expect(res.body.data.login.message).toBe(
            'User logged in successfully',
          );
          expect(res.body.data.login.token).toStrictEqual(expect.any(String));
          token = res.body.data.login.token;
        });
    });
    it('should fail if email and password was wrong', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          operationName: null,
          variables: {
            data: {
              email: 'testsss@mock.com',
              password: '12345678',
            },
          },
          query: `mutation Login($data: loginInput!) {
              login(data: $data) {
                ok
                message
                token
              }
            }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login.ok).toBe(false);
          expect(res.body.data.login.message).toEqual(expect.any(String));
        });
    });
  });
  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await users.find();
      userId = user.id;
    });

    it('should return user profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', token)
        .send({
          operationName: null,
          variables: {
            userId,
          },
          query: `query userProfile($userId: Float!){
            userProfile(userId: $userId) {
              user {id}
              ok
              message
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body?.data?.userProfile.ok).toBe(true);
          expect(res.body?.data?.userProfile.message).toBe(
            'User profile found',
          );
          expect(res.body?.data?.userProfile.user.id).toBe(userId);
        });
    });
    it('should fail if user do not exist', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', token)
        .send({
          operationName: null,
          variables: {
            userId: 234,
          },
          query: `query userProfile($userId: Float!){
            userProfile(userId: $userId) {
              user {
                id
              }
              ok
              message
              
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body?.data?.userProfile.ok).toBe(false);
          expect(res.body?.data?.userProfile.message).toBe(
            'User does not exist',
          );
          expect(res.body?.data?.userProfile.user).toBe(null);
        });
    });
    it('should fail if user does not have permission', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', 'WrongToken')
        .send({
          operationName: null,
          variables: {
            userId: 234,
          },
          query: `query userProfile($userId: Float!){
            userProfile(userId: $userId) {
              user {
                id
              }
              ok
              message
              
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          const [error] = res.body?.errors;
          expect(res.body?.data).toBe(null);
          expect(error?.message).toBe('Forbidden resource');
        });
    });
  });
  describe('loggedInUser', () => {
    it('should return logged in user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', token)
        .send({ query: `query loggedInUser {loggedInUser {email}}` })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.loggedInUser.email).toBe('test@mock.com');
        });
    });
    it('should fail if user does not have permission', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', 'WrongToken')
        .send({ query: `query loggedInUser {loggedInUser {email}}` })
        .expect(200)
        .expect((res) => {
          const [error] = res.body?.errors;
          expect(res.body?.data).toBe(null);
          expect(error?.message).toBe('Forbidden resource');
        });
    });
  });
  describe('updateUser', () => {
    it('should update user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', token)
        .send({
          variables: { data: { email: 'omid@mock.com' } },
          query: `mutation UpdateUser($data: UpdateUserInput!) {
            updateUser(data: $data) {
              ok
              message
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateUser.ok).toBe(true);
          expect(res.body.data.updateUser.message).toBe(
            'User Updated Successfully',
          );
        });
    });
  });
  describe('validateEmail', () => {
    let code: string;
    beforeAll(async () => {
      const [validation] = await usersValidation.find();
      code = validation.code;
    });
    it('should pass validateEmail if code was correct', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', token)
        .send({
          variables: { data: { code } },
          query: `mutation validateEmail($data: ValidateEmailInput!) {
            validateEmail(data: $data) {
              message
              ok
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.validateEmail.ok).toBe(true);
          expect(res.body.data.validateEmail.message).toBe(
            'Email verified successfully',
          );
        });
    });
    it('should fail validateEmail if code was wrong', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('Authorization', token)
        .send({
          variables: { data: { code: 'invalidcode' } },
          query: `mutation validateEmail($data: ValidateEmailInput!) {
            validateEmail(data: $data) {
              message
              ok
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.validateEmail.ok).toBe(false);
          expect(res.body.data.validateEmail.message).toBe('Invalid Code');
        });
    });
  });
});
