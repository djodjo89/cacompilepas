import React, {ReactNode} from 'react';
import SearchBar from './SearchBar';
import '../../css/Nav.css';
import Svg from '../Assets/Svg';

class Nav extends React.Component {
    public render(): ReactNode {
        return (
            <nav className="row mt-3">
                <div className="col-lg-2 col-md-2 col-sm-5 col-xs-4 mr-lg-0 mr-sm-0">
                    <a href='/' className='col-lg-1 col-sm-2 pl-lg-0 pl-md-0 pl-sm-0 pf-sm-0 mr-lg-5 mr-sm-0 pr-sm-0'>
                        <Svg/>
                    </a>
                    <a id="home-link" href='/'
                       className="mt-1 col-lg-1 col-sm-2 pl-lg-1 pl-sm-2 ml-lg-0 mt-lg-3">caCompilePas</a>
                </div>
                <SearchBar/>
                <a id="user" href="/connexion/login"
                   className="col-lg-1 col-sm-2 mt-lg-1 mt-md-1 mt-sm-3 pt-lg-2 pr-lg-5 pr-sm-1 pl-lg-3 pl-sm-4 text-left">
                    <span
                        className={"glyphicon glyphicon-user"}></span>
                </a>
            </nav>
        )
    }
}

export default Nav;
