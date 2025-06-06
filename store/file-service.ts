// store/file-service.ts
import { defineStore } from 'pinia'
import { uploadMediaFile } from '~/composables/consume-api/file-service.api'

export const useFileServiceStore = defineStore('file-service', {
    actions: {
        async uploadFileBase64(file: File) {
            try {
                const reader = new FileReader()
                return await new Promise<string>((resolve, reject) => {
                    reader.onload = async () => {
                        try {
                            const base64String = (reader.result as string).split(',')[1] // hapus data:image/png;base64,
                            const response = await uploadMediaFile(base64String, file.name)
                            resolve(response.data.url)
                        } catch (e) {
                            reject(e)
                        }
                    }
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })
            } catch (err) {
                throw new Error('Gagal upload file: ' + err)
            }
        }

    }
})
