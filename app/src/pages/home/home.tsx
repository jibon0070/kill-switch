import {useEffect} from "react";
import UsersService from "../../services/users.service";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!['admin'].includes(UsersService.role)) navigate('/users/login');
    }, []);
    return <div id="home">home</div>
}