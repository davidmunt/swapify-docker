import * as admin from 'firebase-admin';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {
  constructor(private configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'), 
        privateKeyId: configService.get<string>('FIREBASE_PRIVATE_KEY_ID'), 
        privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'), 
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'), 
        clientId: configService.get<string>('FIREBASE_CLIENT_ID'),
        authUri: configService.get<string>('FIREBASE_AUTH_URI'), 
        tokenUri: configService.get<string>('FIREBASE_TOKEN_URI'),
        authProviderX509CertUrl: configService.get<string>('FIREBASE_AUTH_PROVIDER_CERT_URL'),
        clientC509CertUrl: configService.get<string>('FIREBASE_CLIENT_CERT_URL'), 
      } as admin.ServiceAccount),
    });
  }
}
