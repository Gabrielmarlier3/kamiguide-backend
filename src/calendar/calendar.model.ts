import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'schedule', timestamps: true })
export class CalendarModel extends Model<CalendarModel> {
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
    type: DataType.ENUM(
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ),
    allowNull: false,
  })
  day: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  release_time: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  episode_count: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_url: string;
}
