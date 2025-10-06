import { Children, createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
    const userStatus = useContext(AuthContext);
    return userStatus;
}


export const AuthContextProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
    );

    const updateUser = (data) => {
        setCurrentUser(data);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser) )
    }, [currentUser])

    return <AuthContext.Provider value={{currentUser, updateUser}} >
        {children}
    </AuthContext.Provider>
}