'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 06defc32-8a22-4152-8d15-834acf6456875`,
          },
          body: JSON.stringify({ username, password }),
        }
      )

      if (response.ok) {
        const data = await response.json()

        // Usa a função login do contexto que já salva no localStorage
        login(data.access_token)

        toast.success('Login realizado com sucesso!')
        router.push('/')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erro ao efetuar login')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      toast.error('Erro ao conectar com o servidor')
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Login</h1>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Usuário
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Senha
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition duration-200'
          >
            Entrar
          </button>
        </form>
      </div>
      <ToastContainer position='bottom-center' autoClose={5000} />
    </div>
  )
}
