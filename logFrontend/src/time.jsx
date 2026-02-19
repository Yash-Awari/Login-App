import { useNavigate } from 'react-router-dom'
import './css/singup.css'

function Signup (){

    const Navigate = useNavigate()

    const handleSubmit = async (e)=>{

        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        const jsonData = JSON.stringify(data)
        console.log('jsonData', jsonData)

        try {

            const response = await fetch('http://localhost:8000/api/v1/users/signup',{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:jsonData
            })

            console.log('response', await response.text())
            
        } catch (error) {
           console.error("error sending data", error)            
        }

        Navigate("/")
    
    }

    return(
        <>
            <form id="signup" method="POST"  onSubmit={handleSubmit}>
                <input type="email" placeholder="email" name="email" required/>
                <input type="text" placeholder="userName" name="userName" required/>
                <input type="text" placeholder="fullName" name="fullName" required/>
                <input type="password" placeholder="password" name="password" required/>
                <button type="submit" >submit</button>
            </form>
        </>
    )
}

export default Signup