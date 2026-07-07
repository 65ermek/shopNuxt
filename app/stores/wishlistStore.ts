// stores/wishlistStore.ts
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCartStore } from './cartStore'

interface Product {
    id: number
    name: string
    slug: string
    price: string | number
    old_price?: string | number | null
    image?: string | null
    [key: string]: any
}

interface CartItem {
    id: number
    product_id: number
    product?: Product
    quantity: number
    type: 'cart' | 'favorite' | 'history'
    [key: string]: any
}

export const useWishlistStore = defineStore('wishlist', () => {
    const cartStore = useCartStore()

    // 📊 Геттеры - используем данные из cartStore
    const items = computed<CartItem[]>(() => cartStore.favoriteItems)

    const count = computed<number>(() => items.value.length)

    const isFavorite = (productId: number): boolean => {
        return items.value.some(item => item.product_id === productId)
    }

    // ❤️ Добавление в избранное
    const addToWishlist = async (product: Product): Promise<void> => {
        try {
            if (isFavorite(product.id)) {
                console.log('ℹ️ Produkt již je v oblíbených')
                return
            }

            await cartStore.addItem(product, 1, 'favorite')
            console.log('❤️ Produkt přidán do oblíbených:', product.name)

        } catch (error) {
            console.error('❌ Chyba při přidávání do oblíbených:', error)
            throw error
        }
    }

    // ❌ Удаление из избранного
    const removeFromWishlist = async (productId: number): Promise<void> => {
        try {
            const item = items.value.find(i => i.product_id === productId)
            if (!item) {
                console.log('ℹ️ Položka nebyla nalezena v oblíbených')
                return
            }

            await cartStore.removeItem(item.id)
            console.log('🗑️ Produkt odebrán z oblíbených')

        } catch (error) {
            console.error('❌ Chyba při odebírání z oblíbených:', error)
            throw error
        }
    }

    // 🔄 Переключение избранного
    const toggleWishlist = async (product: Product): Promise<void> => {
        if (isFavorite(product.id)) {
            await removeFromWishlist(product.id)
        } else {
            await addToWishlist(product)
        }
    }

    // 🗑 Очистка избранного
    const clearWishlist = async (): Promise<void> => {
        try {
            for (const item of items.value) {
                await cartStore.removeItem(item.id)
            }
            console.log('🗑️ Všechny oblíbené položky byly odebrány')
        } catch (error) {
            console.error('❌ Chyba při mazání oblíbených:', error)
            throw error
        }
    }

    return {
        items,
        count,
        isFavorite,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist
    }
})