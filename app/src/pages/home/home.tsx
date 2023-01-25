import {useEffect, useRef} from "react";
import UsersService from "../../services/users.service";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import "./home.scss";
import PageNotFound from "../page-not-found/page-not-found";
import New from "./new/new"

export default function Home() {
    return <Routes>
        <Route path="" element={<Index/>}/>
        <Route path={"new"} element={<New/>}/>
        <Route path={"*"} element={<PageNotFound/>}/>
    </Routes>
}

function Index() {
    const navigate = useNavigate();
    const home_ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (['visitor'].includes(UsersService.role)) navigate('/users/login');
        else {
            if (home_ref.current) {
                const parent: any = (home_ref.current.parentNode)
                home_ref.current.style.height = parent.clientHeight + "px";
            }
        }
    }, []);
    return <div id="home" ref={home_ref}>
        {
            UsersService.role === 'general' ?
                <div className="general">
                    <h1 className="align-center">You should not be here.</h1>
                </div> :
                null
        }
        {
            UsersService.role === 'admin' ?
                <div className="admin">
                    <div className="container">
                        <h1 className="align-center">Switches</h1>
                        <div className="align-right mt-3">
                            <Link to={"new"} className={"btn bg-primary"}>New</Link>
                        </div>
                        <div className="responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th style={{width: "10px"}}>#</th>
                                    <th>Link</th>
                                    <th style={{width: "10px"}}>Switch</th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div> :
                null
        }
    </div>
}