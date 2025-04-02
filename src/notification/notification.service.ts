import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor() {}

  //envia una notificacion push cuando se da like a un producto
  async sendNotificationLikeProduct(message: any): Promise<void> {
    try {
      const mensaje = {
        notification: {
          title: message.title,
          body: message.body,
        },
        android: {
          notification: {
            icon: 'ic_stat_logo', 
          },
        },
        token: message.token,
      };
      await admin.messaging().send(mensaje);
    } catch (error) {
      throw new HttpException('Error enviando la notificacion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 

  //envia una notificacion push con un mensaje y añado datos para que me redirija a /chat con la informacion necesaria
  async sendNotificationMessage(message: any): Promise<void> {
    try {
      const mensaje = {
        notification: {
          title: message.title,
          body: message.body,
        },
        android: {
          notification: {
            icon: 'ic_stat_logo',
          },
        },
        data: {
          ruta: '/chat', 
          productId: message.productId ? message.productId.toString() : '',
          productOwnerId: message.productOwnerId ? message.productOwnerId.toString() : '',
          potBuyerId: message.potBuyerId ? message.potBuyerId.toString() : '',
        },
        token: message.token,
      };
      await admin.messaging().send(mensaje);
    } catch (error) {
      throw new HttpException('Error enviando la notificacion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }  
}
