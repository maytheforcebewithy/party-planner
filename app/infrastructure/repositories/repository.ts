/**
 * Read-only repository contract. Deliberately generic — no party/domain logic
 * yet. Concrete repositories (e.g. a future PartyRepository) implement this
 * against the `Database` abstraction, so callers never touch storage directly.
 */
export interface Repository<TEntity, TId = string> {
  findById: (id: TId) => Promise<TEntity | null>
  findAll: () => Promise<readonly TEntity[]>
}
