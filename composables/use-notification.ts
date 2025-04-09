import { ref } from 'vue'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: number
  type: NotificationType
  message: string
  timeout?: number
}

export function useNotification() {
  const notifications = ref<Notification[]>([])
  let nextId = 1
  
  // Add a notification
  const notify = (
    message: string, 
    type: NotificationType = 'info', 
    timeout: number = 5000
  ) => {
    const id = nextId++
    
    const notification: Notification = {
      id,
      type,
      message,
      timeout
    }
    
    notifications.value.push(notification)
    
    if (timeout > 0) {
      setTimeout(() => {
        remove(id)
      }, timeout)
    }
    
    return id
  }
  
  // Shorthand methods
  const success = (message: string, timeout?: number) => 
    notify(message, 'success', timeout)
  
  const error = (message: string, timeout?: number) => 
    notify(message, 'error', timeout)
  
  const info = (message: string, timeout?: number) => 
    notify(message, 'info', timeout)
  
  const warning = (message: string, timeout?: number) => 
    notify(message, 'warning', timeout)
  
  // Remove a notification
  const remove = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  // Clear all notifications
  const clear = () => {
    notifications.value = []
  }
  
  return {
    notifications,
    notify,
    success,
    error,
    info,
    warning,
    remove,
    clear
  }
}