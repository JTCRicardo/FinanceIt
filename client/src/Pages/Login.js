import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn, useClerk } from '@clerk/clerk-react';
import './Login.css';
export default function Login() {
    const { signIn, setActive } = useSignIn();
    const { signOut } = useClerk();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    //WORK IN PROGRESS
    //const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    //states used for the user to type in their info/for program to respond

    // Sign out any existing user when component mounts
    useEffect(() => {
        signOut();
    }, [signOut]);

    //function that handles when user clicks sign in
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            console.log('Attempting login with:', { email, password: '***' });
            const response = await signIn.create({
                identifier: email,
                password: password,
            });
            console.log('Clerk login response:', response);
            if (response.status === 'complete') {
                setActive({ session: response.createdSessionId });
                navigate('/dashboard');
            } else {
                setError(response?.errors?.[0]?.longMessage || 'Unexpected response from Clerk.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err?.errors?.[0]?.longMessage || "An error occurred. Please try again.");
        }
    };
    return(
        <div className="login-container">

            <h1 className="logo-title">

                <div className="logo-top">
                    <span>💰</span>
                    <span>FinanceIT</span>
                    <span>💰</span>
                </div>

                <div className="logo-bottom">
                    <span>💰</span>
                    <span>FinanceIT</span>
                    <span>💰</span>
                </div>

                <div className="logo-middle">
                    Make finances simple.
                </div>
            </h1>

            <div className="login-box">
                <h2>Sign in to your account</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type = "password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign In</button>
                </form>
                <div className="login-footer">
                    <div><a href="#">Forgot password?</a></div>
                    <div>New to FinanceIt? <Link to="/signup">Create an account</Link></div>
                </div>
            </div>
        </div>
    );
}

