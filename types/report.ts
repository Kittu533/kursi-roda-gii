export interface Agent {
  id: string
  full_name: string
  email: string
  phone: string
  location: string
}

export interface Report {
  id: string
  agent_id: string
  report_date: string
  created_at: string
  updated_at: string
  agent: Agent
}

export interface ReportListResponse {
  response: {
    page: {
      total_record_count: number
      batch_number: number
      batch_size: number
      max_batch_size: number
    }
    records: Report[]
  }
  metaData: {
    message: string
    code: number
    response_code: string
  }
}

export interface ReportSingleResponse {
  response: Report
  metaData: {
    message: string
    code: number
    response_code: string
  }
}

export interface CreateReportPayload {
  agent_id: string
  report_date: string
  // tambahkan field lain jika ada
}
