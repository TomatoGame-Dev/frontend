import { createContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

export const AuthContext = createContext();

// 마이페이지 리다이렉션 문제 해결
// AuthContext에서 user === undefined 상태랑 loading을 구분해서 제공
function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); //
    const [loading, setLoading] = useState(true);

    const signup = async ({
        name,
        email,
        age,
        code,
        password,
        confirm,
        type,
        agreements,
    }) => {
        try {
            const res = await api.post("/auth/join/step3", {
                // 추후 경로 변경 필요
                name,
                email,
                age,
                code,
                password,
                confirm,
                type,
                agreements,
                state_code: "active",
            });

            const { user, accessToken } = res.data;

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);

            return res.data;
        } catch (err) {
            console.error("❌ signup axios 에러", err);
            throw err;
        }
    };

    const login = async ({ email, password }) => {
        const res = await api.post("/auth/login", { email, password });
        const { user, accessToken } = res.data;

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);

        return res.data;
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    };

    // 로그인 확인, 토큰 없으면 요청하지 않도록 함
    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/api/user/me");  // 추후 경로명 변경
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, loading, signup, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
