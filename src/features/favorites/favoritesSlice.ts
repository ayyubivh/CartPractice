import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteState {
    favoriteIds: string[]
}

const initialState: FavoriteState = {
      favoriteIds: []
}

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers:{
        toggledFavorites: (state, action: PayloadAction<string>) =>{
            const productId = action.payload;
            const index = state.favoriteIds.indexOf(productId);

            if(index === -1)
            {
                state.favoriteIds.push(productId);
            }
            else 
            {
                state.favoriteIds.splice(index, 1)
            }

        }
    }
});

export const { toggledFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;