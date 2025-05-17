export interface Wheelchair {
    id: string
    model_id: string
    agent_id: string
    serial_number: string
    wheelchairs_status_id: string
    model: {
        id: string
        name: string
        model: string
        stock: number
        max_weight: number
        battery_capacity: number
        price: number
    }
    agent: {
        id: string
        full_name: string
        email: string
        phone: string
        location: string
        open_time: string
        close_time: string
        latitude: string
        longitude: string
    }
    wheelchair_status: {
        id: string
        status: string
    }
}

export interface CreateWheelchairPayload {
    model_id: string
    agent_id: string
    serial_number: string
    wheelchairs_status_id: string
}

export interface WheelchairApiListResponse {
    response: {
        records: Wheelchair[]
        page: {
            total_record_count: number
            batch_number: number
            batch_size: number
            max_batch_size: number
        }
    }
    metaData: {
        message: string
        code: number
        response_code: string
    }
}

export interface WheelchairApiSingleResponse {
    response: Wheelchair
    metaData: {
        message: string
        code: number
        response_code: string
    }
}

export interface WheelchairFilter {
    agent_id?: string
    model_id?: string
    status?: string
    page: number
    itemsPerPage: number
}

export interface WheelchairPagination {
    currentPage: number
    total: number
    totalPages: number
    itemsPerPage: number
    data: Wheelchair[]
}
