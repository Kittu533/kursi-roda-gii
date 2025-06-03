// types/maintenance.d.ts
export interface MaintenanceStatus {
  id: string;
  status: string;
}

export interface MaintenanceRecord {
  id: string;                      // ID Pemeliharaan
  wheelchair_id: string;
  model: string;                   // Model
  serial_number: string;           // Nomor Seri
  photo: string | null;            // Foto
  description: string | null;      // Deskripsi
  start_date: string;              // Tanggal Pemeliharaan
  end_date: string | null;         // Tanggal Selesai Perbaikan
  maintenance_status: MaintenanceStatus; // Status
  maintenance_status_id: string;
}

export interface MaintenancePagination {
  currentPage: number;
  total: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface MaintenanceFilter {
  startDate: string;
  endDate: string;
  status: string;
  page: number;
  itemsPerPage: number;
}

export interface CreateMaintenancePayload {
  wheelchair_id: string;
  model: string;
  serial_number: string;
  photo: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
}

export interface MaintenanceResponse {
  response: {
    page: {
      total_record_count: number;
      batch_number: number;
      batch_size: number;
      max_batch_size: number;
    };
    records: MaintenanceRecord[];
  };
  metaData: {
    message: string;
    code: number;
    response_code: string;
  };
}
