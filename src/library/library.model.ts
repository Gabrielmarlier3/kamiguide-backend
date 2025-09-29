import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'library',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class LibraryModel extends Model<
  InferAttributes<LibraryModel>,
  InferCreationAttributes<LibraryModel>
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare user_uid: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare mal_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.ENUM('movie', 'series'),
    allowNull: false,
  })
  declare media_type: 'movie' | 'series';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare season?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare image_url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare year?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare status: string;
}
