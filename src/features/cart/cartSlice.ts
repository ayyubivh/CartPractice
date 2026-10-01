import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem  } from '../../types'
import { RootState } from '../../store/store';
interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers :{
        addToCart: (state, action: PayloadAction<{productId: number, quantity?: number}>) =>{
            const {productId, quantity = 1} = action.payload;
            const existing = state.items.find(item => item.productId === productId);

            if(existing)
            {
                existing.quantity += quantity;
            }else{
                state.items.push({productId, quantity});
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) =>{
              state.items = state.items.filter(item => item.productId !== action.payload)
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>) =>{
            
            const { quantity, productId } = action.payload;
            
            if(quantity <= 0)
            {
                state.items = state.items.filter(item => item.productId !== productId)
                return;
            }
        
            const item = state.items.find(i => i.productId === productId);
            if(item){
                item.quantity = quantity
            }
        },
        clearCart: state =>{
            state.items = []
        }

    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;


export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = (state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((sum, item) => {
        const product = state.products.items.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

export default cartSlice.reducer;