import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'schedule',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CalendarModel extends Model<
  InferAttributes<CalendarModel>,
  InferCreationAttributes<CalendarModel>
> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare user_uid: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare mal_id: number;

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
  declare day: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare release_time: string | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare episode_count: number | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare image_url: string | null;
}
