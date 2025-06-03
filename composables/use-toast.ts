export const useSafeToast = () => {
  const toast = useToast()
  return {
    error: (message: string) => toast.add({ title: 'Error', description: message, color: 'red' }),
    success: (message: string) => toast.add({ title: 'Berhasil', description: message, color: 'green' })
  }
}
