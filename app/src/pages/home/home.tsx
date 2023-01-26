import React, {useEffect, useRef, useState} from "react";
import UsersService from "../../services/users.service";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import "./home.scss";
import PageNotFound from "../page-not-found/page-not-found";
import New from "./new/new"
import HomeService from "../../services/home.service";
import Loading from "../../loading/loading";
import {http_response_type} from "../../http";
import Switch from "../../components/switch/switch";
import Config from "../../config";

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
    const [loading, set_loading] = useState(false);
    const [switches, set_switches] = useState<{
        status: boolean;
        link: string;
        id: string;
    }[]>([])
    useEffect(() => {
        let index: http_response_type<{
            switches: {
                status: boolean;
                link: string;
                id: string;
            }[];
        }>;
        if (['visitor'].includes(UsersService.role)) navigate('/users/login');
        else {
            if (home_ref.current) {
                const parent: any = (home_ref.current.parentNode)
                home_ref.current.style.height = parent.clientHeight + "px";
            }
            if (UsersService.role === 'admin') {
                set_loading(true);
                index = HomeService.index;
                index.result.then(r => {
                    set_switches(r.switches);
                    set_loading(false);
                });
            }
        }
        return () => {
            index?.controller?.abort();
        };
    }, []);

    function toggle_status(e: React.ChangeEvent<HTMLInputElement>, id: string) {
        set_switches(prev => prev.map(s => {
            if (s.id === id) {
                s.status = e.target.checked;
            }
            return s;
        }));
        HomeService.toggle_status({id, checked: e.target.checked}).result.then(() => {
        });
    }

    function delete_switch(id: string) {
        if (window.confirm("Are you sure you want to delete this switch?")) {
            HomeService.delete(id).result.then((r) => {
                console.log(r);
                if (r.success) {
                    set_switches(prev => prev.filter(s => s.id !== id));
                }
            })
        }
    }

    return <div id="home" ref={home_ref}>
        {loading ? <Loading/> : null}
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
                        {
                            switches?.length ?
                                <div className="responsive">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th style={{width: "10px"}}>#</th>
                                            <th>Link</th>
                                            <th style={{width: "10px"}}>Switch</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {switches?.map((c_switch, i) => <tr key={c_switch.id}>
                                            <td>{i + 1}</td>
                                            <td><a href={Config.api + "/" + c_switch.link}
                                                   target={"_blank"}>{Config.api}/{c_switch.link}</a></td>
                                            <td style={{display: "flex", gap: ".25em", alignItems: "center"}}>
                                                <Switch checked={c_switch.status}
                                                        onChange={e => toggle_status(e, c_switch.id)}/>
                                                <button title={"Delete"} onClick={() => delete_switch(c_switch.id)}
                                                        className={"btn bg-warn circle small"}><i
                                                    className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>)}
                                        </tbody>
                                    </table>
                                </div> :
                                <p className="mt-3 align-center">No switch found.</p>
                        }
                    </div>
                </div> :
                null
        }
    </div>;
}