function Auth({ isLogin }) {
  return <>{isLogin ? <h1>Login Page</h1> : <h1>Signup Page</h1>}</>;
}

export default Auth;
