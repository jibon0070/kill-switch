import UsersService from "../../services/users.service"
import "./header.scss";
import {Link} from "react-router-dom";
import React from "react";

export default function Header({fref}: { fref?: React.Ref<HTMLDivElement> }) {
    return <div id="header" ref={fref}>
        <h1>Kill Switch</h1>
        <ul>
            {UsersService.role !== 'visitor' ? <li><Link to={'/users/logout'}>Logout</Link></li> : null}
        </ul>
    </div>
}