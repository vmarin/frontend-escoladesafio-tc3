export function Footer() {
  return (
    <footer className='bg-white shadow-md p-4 mt-auto'>
      <div className='container mx-auto text-center text-gray-600'>
        <p>
          © {new Date().getFullYear()} Escola Desafio. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  )
}
