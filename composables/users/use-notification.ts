import { ref, readonly } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
    id: string
    message: string
    type: NotificationType
    duration: number
}

export function useNotification() {
    const notifications = ref<Notification[]>([])

    // Add a new notification
    const showNotification = (
        message: string,
        type: NotificationType = 'info',
        duration: number = 5000
    ): string => {
        const id = Date.now().toString()

        const notification: Notification = {
            id,
            message,
            type,
            duration
        }

        notifications.value.push(notification)

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }

        return id
    }

    // Remove a notification by ID
    const removeNotification = (id: string): void => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index !== -1) {
            notifications.value.splice(index, 1)
        }
    }

    // Clear all notifications
    const clearNotifications = (): void => {
        notifications.value = []
    }

    return {
        notifications: readonly(notifications),
        showNotification,
        removeNotification,
        clearNotifications
    }
}