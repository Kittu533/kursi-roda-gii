export interface Voucher {
  id: string
  voucher_code: string
  discount_percentage: string // "10.00" (string, sesuai response)
  max_discount: number
  min_order_amount: number
  start_date: string // ISO date string
  end_date: string // ISO date string
  usage_limit: number
  used_count: number
  vouchers_status_id: string
  voucher_status: VoucherStatus
}
export interface VoucherStatus {
  id: string
  status: string // contoh: "active"
}
export interface VoucherApiSingleResponse {
  response: {
    data: Voucher
  }
  metaData: {
    message: string
    code: number
    response_code: string
  }
}


export interface CreateVoucherPayload {
  voucher_code: string
  discount_percentage: string
  start_date: string
  end_date: string
  usage_limit: number
  vouchers_status_id?: string
}

export interface UpdateVoucherPayload extends Partial<CreateVoucherPayload> { }

export interface VoucherApiListResponse {
  response: {
    page: {
      total_record_count: number
      batch_number: number
      batch_size: number
    }
    records: Voucher[]
  }
  metaData: {
    message: string
    code: number
    response_code: string
  }
}

// export interface VoucherApiSingleResponse {
//   response: Voucher
//   metaData: {
//     message: string
//     code: number
//     response_code: string
//   }
// }

export interface VoucherFilter {
  voucher_code?: string
  status?: string
  page: number
  itemsPerPage: number
}

export interface VoucherPagination {
  page: number
  totalItems: number
  totalPages: number
  itemsPerPage: number
}
