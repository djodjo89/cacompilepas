import React, {Provider, Consumer} from 'react';

class AuthContext<T> extends React.Component<{ value: {} }, {}>{
    private static context:
        React.Context<{ token: string, setToken: any }>
        = React.createContext({
            token: '',
            setToken: null
        });
    public static Provider: Provider<{ token: string, setToken: any }>
        = AuthContext.context.Provider;
    public static Consumer: Consumer<{ token: string, setToken: any }>
        = AuthContext.context.Consumer;
}

export default AuthContext;
