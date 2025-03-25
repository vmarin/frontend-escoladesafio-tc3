'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'

type HeaderProps = {
  title?: string
  showBackButton?: boolean
  backHref?: string
  showNewPostButton?: boolean
  showAuthButton?: boolean // Nova prop específica para controle do botão de auth
}

export function Header({
  title = 'Escola Desafio',
  showBackButton = false,
  backHref = '/',
  showNewPostButton = false,
  showAuthButton = false, // Valor padrão false
}: HeaderProps) {
  const { token, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Mostrar botão de auth apenas na página inicial
  const shouldShowAuthButton = showAuthButton || pathname === '/'

  return (
    <header className='bg-white shadow-md p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>{title}</h1>

        <div className='flex items-center space-x-4'>
          {showBackButton && (
            <Link
              href={backHref}
              className='flex items-center text-gray-600 hover:text-gray-800 transition duration-200'
            >
              <ArrowLeft className='w-5 h-5 mr-2' />
              Voltar
            </Link>
          )}

          {showNewPostButton && token && (
            <Link
              href='/new-post'
              className='flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-200'
            >
              <Plus className='w-5 h-5 mr-2' />
              Nova Publicação
            </Link>
          )}

          {shouldShowAuthButton && (
            <button
              onClick={() => {
                if (token) {
                  logout()
                  router.push('/')
                } else {
                  router.push('/login')
                }
              }}
              className={`flex items-center px-4 py-2 rounded-lg hover:opacity-90 transition duration-200 cursor-pointer ${
                token ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
            >
              <LogIn className='w-5 h-5 mr-2' />
              {token ? 'Sair' : 'Login'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
