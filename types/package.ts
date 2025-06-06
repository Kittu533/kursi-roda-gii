export interface PackageWheelchair {
  wheelchair_id: string
  guide_include: boolean
}
// Kursi roda di dalam paket (item relasi)
export interface PackageWheelchairItem {
  id: string
  package_id: string
  wheelchair_id: string
  guide_include: boolean
}
// Struktur utama package
export interface Package {
  id: string
  picture: string
  name: string
  description: string
  price: number
  created_at: string
  updated_at: string
  items: PackageWheelchairItem[]
}

// Payload untuk create package (POST)
export interface PackagePayload {
  name: string
  picture: string
  description: string
  price: number
  wheelchairs: {
    wheelchair_id: string
    guide_include: boolean
  }[]
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
