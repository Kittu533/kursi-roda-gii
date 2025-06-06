import { useApi } from '@/composables/use-fetch-api'

export interface UploadMediaResponse {
    data: {
        url: string
    }
    metaData: {
        message: string
        code: number
        response_code: string
    }
}


// Fungsi upload, base64String = hasil FileReader (data:image/jpeg;base64,...)
export const uploadMediaFile = async (base64String: string, filename: string): Promise<UploadMediaResponse> => {
    return await useApi<UploadMediaResponse>('/media', {
        method: 'POST',
        service: 'file',
        body: {
            filename: filename,       // <-- nama file, misal: "profile.jpg"
            file_data: base64String   // <-- base64 string dari file
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
