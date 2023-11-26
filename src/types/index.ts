export type TUser = {
  // TODO: Rename to just `id`.
  user_id: number
}

export type TTask = {
  description: string | null
  due_date: string | null
  id: number
  title: string
  user_id: TUser['user_id']
}
