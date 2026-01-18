import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    userId: string;
    name: string;
    role: string;
    details: any | null;
};

type AuthState = {
    token: string | null;
    user: User | null;
    userPermissions: any | null;
    isAuthenticated: boolean;
};

const initialState: AuthState = {
    token: null,
    user: null,
    userPermissions: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(
            state,
            action: PayloadAction<{
                token: string;
                user: User;
                userPermissions: any;
            }>
        ) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.userPermissions = action.payload.userPermissions;
            state.isAuthenticated = true;
        },

        logout() {
            return initialState;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
