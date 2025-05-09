# 自动更新时间

## 如果是时间戳

**建表语句：**

```mysql
# src/sql/v0.2.sql

CREATE TABLE `routes_config_tab` (
  `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
  `crash_notify_rule_updated_at` BIGINT unsigned NOT NULL,
  `created_at` BIGINT unsigned NOT NULL,
  `updated_at` BIGINT unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
```

+ 其中 `crash_notify_rule_updated_at`、`created_at`、`updated_at` 都是时间戳。



**装饰器：**

```ts
// src/decorators/date-column.ts

import { BeforeInsert, BeforeUpdate } from 'typeorm'

export function TimestampUpdateDateColumn() {
  return (target: any, columnName: string) => {
    const fnName = `__updateUpdatedDate_${columnName}`
    BeforeUpdate()(target, fnName)
    BeforeInsert()(target, fnName)
    Object.defineProperty(target, fnName, {
      value: function () {
        this[columnName] = new Date().getTime()
      },
    })
  }
}

export function TimestampCreateDateColumn() {
  return (target: any, columnName: string) => {
    const fnName = `__updateCreatedDate_${columnName}`
    BeforeInsert()(target, fnName)
    Object.defineProperty(target, fnName, {
      value: function () {
        this[columnName] = new Date().getTime()
      },
    })
  }
}
```

+ `TimestampUpdateDateColumn` 和 `TimestampCreateDateColumn` 是自定义的装饰器，作用是在实体插入数据库时自动设置字段为当前毫秒数时间戳。
+ 不需要在每次插入或更新时手动赋值，TypeORM 会自动调用这个装饰器修饰的函数。
+ 区别于 TypeORM 的 `@CreateDateColumn()` 默认存储 Date 类型（如 2024-06-10T12:00:00.000Z），`@TimestampCreateDateColumn()` 存储的是 number 类型的时间戳（如 1718000000000）。
+ 需要注意的是，不是所有的方法都会触发装饰器（包括自定义装饰器）：
  + `save()`、`update()` 这类操作**会触发**实体的钩子，包括自定义装饰器，所以会自动赋值。
  + `insert()` 和 `upsert()` 这类操作**不会触发**实体的钩子和自定义装饰器，所以不会自动赋值，需要手动赋值。
  + 这是 TypeORM 的机制，和自定义装饰器无关。



**实体：**

```ts
// src/entities/routes-config.entity.ts

import { TimestampCreateDateColumn, TimestampUpdateDateColumn } from 'src/decorators/date-column'
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { CrashNotifyRuleType } from '../modules/routes-config/routes-config.dto'

@Entity({ name: 'routes_config_tab' })
export class RoutesConfigEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number

  @Column({
    type: 'bigint',
    name: 'crash_notify_rule_updated_at',
  })
  @TimestampUpdateDateColumn()
  crash_notify_rule_updated_at: number

  @Column({
    type: 'bigint',
    name: 'created_at',
  })
  @TimestampCreateDateColumn()
  created_at: number

  @Column({
    type: 'bigint',
    name: 'updated_at',
  })
  @TimestampUpdateDateColumn()
  updated_at: number
}
```



# Create or Update

批量创建和更新，无则创建有则更新



## upsert 方法

TypeORM 本身提供 [upsert](https://typeorm.io/repository-api#repository-api) 方法，如果需要对 upsert 进行 conflictPathsOrOptions 参数，要求  TypeORM 3.x 及以上。

```ts
const insertResult = await this.routesConfigRepository.upsert(
  [
    {
      id: 1,
      app_id: 123,
      route_pattern: '/api/v1',
      crash_notify_rule: 'always',
      crash_notify_rule_updated_at: Date.now(),
      crash_notify_rule_updated_by: 'user@example.com',
      created_at: Date.now(),
      created_by: 'user@example.com',
      updated_at: Date.now(),
      updated_by: 'user@example.com',
    },
    // ...更多数据
  ],
  {
    conflictPaths: ['app_id', 'route_pattern'], // 冲突判断的唯一键
    skipUpdateIfNoValuesChanged: true, // 可选，只有值变了才更新
    upsertType: 'on-conflict-do-update', // 可选，MySQL/PG
    update: [
      'crash_notify_rule',
      'crash_notify_rule_updated_at',
      'crash_notify_rule_updated_by',
      'updated_at',
      'updated_by',
    ], // 只更新这些字段
  }
);
```



## QueryBuilder.orUpdate

如果是 TypeORM 2.x，可以用 QueryBuilder 的 orUpdate：

```ts
const insertResult = await this.routesConfigRepository
  .createQueryBuilder()
  .insert()
  .into(RoutesConfigEntity)
  .values([
    // ...数据
  ])
  .orUpdate(
    [
      'crash_notify_rule',
      'crash_notify_rule_updated_at',
      'crash_notify_rule_updated_by',
      'updated_at',
      'updated_by',
    ],
    ['app_id', 'route_pattern'] // 冲突判断的唯一键
  )
  .execute();
```



上述两个方法都可以做到：

- 只有在唯一索引冲突时，才会触发 update。

- 只会更新你指定的字段，其它字段保持原值。

- 这种 upsert 方式适合批量同步、批量导入等场景。

但会造成一个问题，数据库中的 id 不连续，且返回的 `insertResult.identifiers` 中的 id 不是数据库更新后的真实 id：

+ MySQL 的自增主键分配机制

  - MySQL 在执行批量插入（或 upsert）时，会预先分配自增 id，即使后续某些行因为唯一约束冲突被 update 而不是 insert，这些 id 也会被“消耗”。

  - 这是一种并发安全和性能优化的设计，避免了并发下的死锁和性能瓶颈。

  - 相关文档：[MySQL官方文档](https://dev.mysql.com/doc/refman/8.0/en/innodb-auto-increment-handling.html)

+ INSERT ... ON DUPLICATE KEY UPDATE 或 REPLACE 语句

  - 只要语句执行，MySQL 的自增计数器就会递增，无论是否真的插入了新行。

  - 这意味着id 可能会跳号，有些 id 实际上没有被任何数据占用。

+ TypeORM 的 upsert/insert 行为
  - TypeORM 的 upsert、insert、save 等方法，底层依赖 MySQL 的行为，无法绕过自增分配机制。
+ 有以下思路解决 id 跳号的问题：
  + 分两步操作，先查后插，只插入不存在的，更新已存在的。
  + 不用自增主键，改用 UUID 或业务主键。
  + 接受 id 跳号。
