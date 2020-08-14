import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrdersProducts1596884687562 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
        new Table({
          name: 'orders_products',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'order_id',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'product_id',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'price',
              type: 'decimal',
              precision: 5,
              scale: 2
            },
            {
              name: 'quantity',
              type: 'numeric',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'orders_products',
        new TableForeignKey({
          name: 'OrderProductOrder',
          columnNames: ['order_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'orders',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'orders_products',
        new TableForeignKey({
          name: 'OrderProductProduct',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable('orders_products');
    }

}
