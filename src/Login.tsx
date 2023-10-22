import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from './utils/firebase'
import { useNavigate } from "react-router-dom";
import { Button } from "./Common";


export function Login() {
    const navigate = useNavigate();
    if (auth.currentUser) {
        navigate('/home');
        return <></>;
    }
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/home');
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return (
        <Button className="w-full p-10 text-2xl m-auto inline-block" variant="submit" onClick={handleGoogleLogin}>Login with Google</Button>
    );
}