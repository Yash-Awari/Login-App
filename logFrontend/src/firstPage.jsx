import { useNavigate } from 'react-router-dom'
import './css/firstPage.css'

function FirstPage (){

    const Navigate = useNavigate()

return(
    <>
        <div className="container">
            <button className="firstPageButton" onClick={()=>Navigate("/signup")}>SignUp</button>
            <button className="firstPageButton" onClick={()=>Navigate("/login")}>Login</button>
        </div>
    </>
)
}

export default FirstPage