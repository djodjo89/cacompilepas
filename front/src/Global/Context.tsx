import React, {Provider, Consumer} from 'react';

class Context<T> extends React.Component<{ value: {} }, {}>{
    private static context:
        React.Context<{ token: string; }>
        = React.createContext({
            token: 'lalalalal'
        });
    public static Provider: Provider<{ token: string; }>
        = Context.context.Provider;
    public static Consumer: Consumer<{ token: string; }>
        = Context.context.Consumer;
}

export default Context;