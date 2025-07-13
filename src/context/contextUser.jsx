import { createContext, useState, useEffect } from 'react';

export const ContextUser = createContext();

const ContextUserProvider = (props) => {
    const [isLogin, setIsLogin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setIsLogin(true);
        }
    }, []);
    return (
        <ContextUser.Provider value={{ isLogin, setIsLogin }}>
            {props.children}
        </ContextUser.Provider>
    );
};

export default ContextUserProvider;
