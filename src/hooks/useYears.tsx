import { useEffect, useState } from "react"
import apiRequest from "../utils/apiRequest";



const useYears = () => {
    const [years, setYears] = useState<number[]>([new Date().getFullYear()]);

    useEffect(() => {
        apiRequest('usuarios/anos-movimentados', 'GET')
        .promisse
        .then(data => {
            setYears(data);
        })
    },[]);

    return years ;
}

export default useYears;