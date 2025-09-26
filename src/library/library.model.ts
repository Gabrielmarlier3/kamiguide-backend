import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'library', timestamps: true })
export class LibraryModel extends Model<LibraryModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_uid: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  mal_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.ENUM('movie', 'series'),
    allowNull: false,
  })
  media_type: 'movie' | 'series';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  season: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  year: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;
}
