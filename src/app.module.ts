import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import { BucketModule } from './bucket/bucket.module';
import { CACHE_EXPIRY, MONGO_DB_URL } from './common/configs/constants';
import { paginatePlugin, searchPlugin } from './common/db-plugins';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TodoModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: CACHE_EXPIRY, // 12 hours
    }),
    CommonModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: MONGO_DB_URL,
        connectionFactory: (connection) => {
          connection.plugin(mongooseAutoPopulate);
          connection.plugin(paginatePlugin);
          connection.plugin(searchPlugin);
          Logger.log('Database connected successfully');
          return connection;
        },
      }),
    }),
    AuthModule,
    MailModule,
    UserModule,
    BucketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
