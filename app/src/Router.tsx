import Users from "./pages/users/users";
import Footer from "./components/Footer/Footer";
import PageNotFound from "./pages/page-not-found/page-not-found";
import Header from "./components/Header/Header";
import Home from "./pages/home/home"
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {useEffect, useRef} from "react";

function Router() {
    const location = useLocation();
    let ref = {
        header: useRef<HTMLDivElement>(null),
        footer: useRef<HTMLDivElement>(null),
        container: useRef<HTMLDivElement>(null)

    };
    useEffect(() => {
        if (ref.container.current)
            ref.container.current.style.minHeight = `calc(100vh - ${ref.header.current?.clientHeight}px - ${ref.footer.current?.clientHeight}px)`;
    }, [location]);
    return (
        <div className="App">
            <Header fref={ref.header}/>
            <div ref={ref.container}>
                <Routes>
                    <Route path={''} element={<Navigate to={"/home"}/>}/>
                    <Route path="home/*" element={<Home/>}/>
                    <Route path={"users/*"} element={<Users/>}/>
                    <Route path={'*'} element={<PageNotFound/>}/>
                </Routes>
            </div>
            <Footer fref={ref.footer}/>
        </div>
    )
}

export default Router
