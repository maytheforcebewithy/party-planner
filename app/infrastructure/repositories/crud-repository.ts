import type { Repository } from './repository'

/**
 * Generic create/read/update/delete repository contract.
 *
 * `TCreate`/`TUpdate` default to full/partial entities but can be narrowed by
 * concrete repositories (e.g. to exclude a generated id on create).
 */
export interface CrudRepository<
  TEntity,
  TId = string,
  TCreate = TEntity,
  TUpdate = Partial<TEntity>,
> extends Repository<TEntity, TId> {
  create: (data: TCreate) => Promise<TEntity>
  update: (id: TId, changes: TUpdate) => Promise<TEntity>
  delete: (id: TId) => Promise<void>
}
