import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'Tipo do report (ex: bug, feedback, sugestão).',
    example: 'bug',
  })
  @IsString({ message: 'Type deve ser uma string' })
  @IsNotEmpty({ message: 'Type não pode estar vazio' })
  type!: string;

  @ApiProperty({
    description: 'Assunto do report.',
    example: 'Problema ao carregar a página de animes',
  })
  @IsString({ message: 'Subject deve ser uma string' })
  @IsNotEmpty({ message: 'Subject não pode estar vazio' })
  @MaxLength(150, { message: 'Subject deve ter no máximo 150 caracteres' })
  subject!: string;

  @ApiProperty({
    description: 'Descrição detalhada do report.',
    example: 'Ao tentar acessar a página de gêneros, o app retorna erro 500.',
  })
  @IsString({ message: 'Description deve ser uma string' })
  @IsNotEmpty({ message: 'Description não pode estar vazia' })
  description!: string;

  @ApiPropertyOptional({
    description: 'Nome do usuário que enviou o report.',
    example: 'Gabriel Souza',
  })
  @IsOptional()
  @IsString({ message: 'Name deve ser uma string' })
  @MaxLength(100, { message: 'Name deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário para contato.',
    example: 'gabriel@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser válido' })
  email?: string;
}
