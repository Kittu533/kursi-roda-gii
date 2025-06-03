export interface WheelchairModel {
  id: string
  name: string
  model: string
  picture: string
  stock: number
  max_weight: number
  guide_compatible: boolean
  battery_capacity: number
  price: number
}

export interface CreateModelPayload {
  name: string
  model: string
  picture: string
  stock: number
  max_weight: number
  guide_compatible: boolean
  battery_capacity: number
  price: number
}

export interface ModelFilter {
  name: string
  guide_compatible: string | boolean | ''
  page: number
  itemsPerPage: number
}

export interface ModelPagination {
  currentPage: number
  total: number
  totalPages: number
  itemsPerPage: number
  data: WheelchairModel[]
}

export interface ModelApiListResponse {
  response: {
    page: {
      total_record_count: number
      batch_number: number
      batch_size: number
      max_batch_size: number
    }
    records: WheelchairModel[]
  }
  metaData: {
    message: string
    code: number
    response_code: string
  }
}

export interface ModelApiSingleResponse {
  response: WheelchairModel
  metaData: {
    message: string
    code: number
    response_code: string
  }
}
