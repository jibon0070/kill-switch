import {useEffect} from "react";
import UsersService from "../../../services/users.service";
import {useNavigate} from "react-router-dom";

export default function Logout() {
    let navigate = useNavigate();
    useEffect(() => {
        if (['visitor'].includes(UsersService.role)) navigate("/users/login");
        else {
            localStorage.clear();
            UsersService.$is_logged_in.emit(false);
            navigate("/users/login");
        }
    }, []);
    return <div id="logout"></div>
};