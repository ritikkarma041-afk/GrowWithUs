import React, { createContext, useReducer, useContext, ReactNode } from "react";

// 1️⃣ Define User and Auth state types
type User = {
  userId: string;
  name: string;
  role: string;
  details: any | null;
};

type AuthState = {
  token: string | null;
  user: User | null;
};

// 2️⃣ Define Actions
type AuthAction =
  | { type: "LOGIN"; payload: { token: string; user: User } }
  | { type: "LOGOUT" };

// 3️⃣ Initial state
const initialState: AuthState = {
  token: null,
  user: null,
};

// 4️⃣ Create Context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// 5️⃣ Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        token: action.payload.token,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

// 6️⃣ AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7️⃣ Custom hook for easier usage
export const useAuthStore = () => useContext(AuthContext);
