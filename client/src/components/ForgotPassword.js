import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleForgotPassword(e) {
    e.preventDefault();
    setLoading(true);
    try {
      
      const response = await axios.post(`${process.env.REACT_APP_URL}/api/auth/forgotpassword`, { email });
      setMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      setMessage(error.response.data.message);
      setLoading(false);
    }
  }

  return (
    <div className='w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 m-4'>
      <form className='space-y-6' onSubmit={handleForgotPassword}>
        <h5 className='text-xl font-medium text-gray-900 dark:text-white'>
        Please enter your email address
        </h5>

        {message && <p className="text-red-500">{message}</p>}

        <div>
          <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
            Your email
          </label>
          <input
            type='email'
            name='email'
            id='email'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
            placeholder='abc@gmail.com'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type='submit'
          className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>

        <div className='text-sm font-medium text-gray-500 dark:text-gray-300'>
          Remembered your password?{' '}
          <Link
            to='/signin'
            className='text-blue-700 hover:underline dark:text-blue-500'
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
