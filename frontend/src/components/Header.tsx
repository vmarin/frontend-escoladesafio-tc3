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
  showAuthButton?: boolean
}

export function Header({
  title,
  showBackButton = false,
  backHref = '/',
  showNewPostButton = false,
  showAuthButton = false,
}: HeaderProps) {
  const { token, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const headerTitle =
    title || (token ? 'Escola Desafio - Professor' : 'Escola Desafio')
  const shouldShowAuthButton = showAuthButton || pathname === '/'

  return (
    <header className='bg-white shadow-md p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-xl md:text-2xl font-bold text-gray-800'>
          {headerTitle}
        </h1>

        <div className='flex items-center gap-2 sm:gap-4'>
          {showBackButton && (
            <Link
              href={backHref}
              className='flex items-center p-2  sm:px-4 sm:py-2 bg-gray-500 text-gray-50 rounded-lg shadow-sm hover:text-gray-800 transition-colors duration-300 hover:bg-gray-200'
              aria-label='Voltar'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline ml-2'>Voltar</span>
            </Link>
          )}

          {showNewPostButton && token && (
            <Link
              href='/new-post'
              className='flex items-center p-2 sm:px-4 sm:py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors duration-300 shadow-sm'
              aria-label={token ? 'Nova Publicação' : 'Login'}
            >
              <Plus className='w-5 h-5' />
              <span className='hidden sm:inline ml-2'>Nova Publicação</span>
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
              className={`flex items-center p-2 sm:px-4 sm:py-2 rounded-lg hover:opacity-80 transition duration-300 cursor-pointer shadow-sm ${
                token ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
              aria-label={token ? 'Sair' : 'Login'}
            >
              <LogIn className='w-5 h-5' />
              <span className='hidden sm:inline ml-2'>
                {token ? 'Sair' : 'Login'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
