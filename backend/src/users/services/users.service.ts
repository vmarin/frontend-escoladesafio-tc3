import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Este método será chamado automaticamente quando o módulo for inicializado
  async onModuleInit() {
    const adminExists = await this.userModel.findOne({ username: 'admin' });

    // Se o admin não existir, cria um novo
    if (!adminExists) {
      const password = 'admin'; // Senha padrão para o admin
      const hashedPassword = await hash(password, 10); // Criptografa a senha

      const adminUser = new this.userModel({
        username: 'admin',
        password: hashedPassword,
        fullName: 'Admin User',
      });

      await adminUser.save(); // Salva o admin no banco
      console.log('Usuário admin criado com sucesso');
    }
  }

  // Método para encontrar um usuário pelo nome de usuário
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user;
  }

  // Método para listar todos os usuários
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
