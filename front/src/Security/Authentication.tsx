import { createContext, useContext } from 'react';

class Authentication {
  private authContext = createContext('authentication');
  public useAuth(){
    return useContext(this.authContext);
  }
  public render() {

  }
}

export default Authentication;