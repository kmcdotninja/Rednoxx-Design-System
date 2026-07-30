/** Standard paginated envelope from Laravel's paginate() */
export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

/** Single-resource envelope */
export interface ApiResource<T> {
  data: T
}

export interface Patient {
  id: number
  first_name: string
  last_name: string
  full_name: string
  date_of_birth: string
  sex: 'M' | 'F' | 'O'
  phone: string | null
  nhia_number: string | null
  blood_group: string | null
  created_at: string
}

export interface Notification {
  id: string
  type: string
  data: Record<string, unknown>
  read_at: string | null
  created_at: string
}
