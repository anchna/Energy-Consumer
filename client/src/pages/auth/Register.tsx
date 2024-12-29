import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
interface RegisterInfo {
  name:string,
  email:string,
  password:string,
}

const Register = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterInfo>({
    defaultValues:{
      name:'',
      email:'',
      password:''
    }
  });
  const handleSubmit = async (data: RegisterInfo) => {
    const { name, email, password } = data;
  
    if (!name || !email || !password) {
      toast.error("All fields are compulsory");
      return; 
    }
  
    try {
      const response = await axios.post('http://localhost:4000/auth/register', { name, email, password });
        
      
  
      // Check the response message for user registration status
      if (response.data.message === "User Already Registerd") {
        // Show an error toast if the user is already registered
        toast.error("User is already registered.");
        navigate('/login');
        return;
      }
  
      if (response.data.message === "") {
        // Navigate to the login page on successful registration
        toast.success("Registration successful!");
        navigate('/login');
        return ;
      }
    } catch (error) {
      // Log the error and display a fallback error toast
      console.error('Error during registration:', error);
      toast.error("Some error occurred. Please check your inputs and try again.");
    }
  };
  
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
       <div className="w-full max-w-md p-8 space-y-8 bg-slate-200 rounded-lg shadow-md">
       <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Register  to Energy Consumption Optimizer
          </h1>
          <p className="mb-4">Sign Up to continue</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} >
          <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UserName</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
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
             <Button className="w-full mt-8" type="submit">
              Sign In
            </Button>
          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Already  a member ?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>

        </div>
      </div>
  )
}

export default Register