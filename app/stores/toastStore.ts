// stores/toastStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ToastOptions {
    message: string
    subMessage?: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    html?: boolean
}

interface ToastState {
    visible: boolean
    message: string
    subMessage: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration: number
    html: boolean
}

export const useToastStore = defineStore('toast', () => {
    const toast = ref<ToastState>({
        visible: false,
        message: '',
        subMessage: '',
        type: 'info',
        duration: 4000,
        html: false
    })

    let timer: ReturnType<typeof setTimeout> | null = null

    const show = (options: ToastOptions) => {
        console.log('🔔 TOAST SHOW:', options) // ✅ Проверяем вызов

        if (timer) {
            clearTimeout(timer)
            timer = null
        }

        toast.value = {
            visible: true,
            message: options.message,
            subMessage: options.subMessage || '',
            type: options.type || 'info',
            duration: options.duration || 4000,
            html: options.html || false
        }

        console.log('🔔 TOAST STATE:', toast.value) // ✅ Проверяем состояние

        if (toast.value.duration > 0) {
            timer = setTimeout(() => {
                close()
            }, toast.value.duration)
        }
    }

    const close = () => {
        toast.value.visible = false
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }

    const success = (message: string, subMessage?: string, duration?: number) => {
        show({ message, subMessage, type: 'success', duration })
    }

    const error = (message: string, subMessage?: string, duration?: number) => {
        show({ message, subMessage, type: 'error', duration })
    }

    const warning = (message: string, subMessage?: string, duration?: number) => {
        show({ message, subMessage, type: 'warning', duration })
    }

    const info = (message: string, subMessage?: string, duration?: number) => {
        show({ message, subMessage, type: 'info', duration })
    }

    return {
        toast,
        show,
        close,
        success,
        error,
        warning,
        info
    }
})