export interface Package {
  id: string
  name: string
  price: string
  deleted_at?: string | null
}

export interface PackagePayload {
  name: string
  price: string
}

export interface PackageApiResponse {
  response: Package
  metaData: {
    message: string
    code: number
    response_code: string
  }
}

export interface PackageListResponse {
  response: Package[]
  metaData: {
    message: string
    code: number
    response_code: string
  }
}
