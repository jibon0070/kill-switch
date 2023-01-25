import Login from "./login/login";
import {Route, Routes} from "react-router-dom";
import PageNotFound from "../page-not-found/page-not-found";
import Register from "./register/register";
import Logout from "./logout/logout";

export default function Users() {
    return <Routes>
        <Route path={""} element={<Index/>}/>
        <Route path={"login"} element={<Login/>}/>
        <Route path={"register"} element={<Register/>}/>
        <Route path={"logout"} element={<Logout/>}/>
        <Route path={"*"} element={<PageNotFound/>}/>
    </Routes>
};

function Index() {
    return <div id="users">Users</div>
}