import React, { ReactElement, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../providers/AuthProvider';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';


interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = (): ReactElement => {
  const navigate = useNavigate();
  const { user,setUser } = useAuth();


 
  const form = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: ''
    }
  });


  useEffect(() => {
    if (user) {
      navigate('/'); 
    }
  }, [user, navigate]); 

  
  const onSubmit: SubmitHandler<LoginFormInputs> = async(data) => {
    const { email, password } = data;

    if (!email || !password) {
      toast.error('Please fill in both email and password'); // Show toast if email or password is missing
      return;
    }

    
    try {
    const obj = {email,password};
    const response = await axios.post('http://localhost:4000/auth/login',obj);
    if(response.status===200){
      await localStorage.setItem("token",response.data?.token);
      toast.success(response.data.message);
      setUser(response.data.user)
      navigate('/');
    }
    else if(response.status==401){
      toast.error("Invalid Credentials");
    }
    else{
      toast.error("Internal Server Error");
    }
  
    } catch (error) {
      toast('Login failed. Please try again.'); // Show error toast if login fails
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-200 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Energy Consumption Optimizer
          </h1>
          <p className="mb-4">Sign in to continue</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
