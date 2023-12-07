'use client'
import { AiOutlineCar } from 'react-icons/ai'
import { useParamsStore } from '../hooks/useParamsStore'
import { usePathname, useRouter } from 'next/navigation'

const Logo = () => {
  const router = useRouter()
  const pathname = usePathname()
  const reset = useParamsStore((state) => state.reset)

  const doReset = () => {
    if (pathname !== '/') router.push('/')
    reset()
  }

  return (
    <div
      className='cursor-pointer flex items-center gap-2 text-3xl font-semibold text-red-500'
      onClick={doReset}
    >
      <AiOutlineCar size={34} />
      <div>Carsties Auctions</div>
    </div>
  )
}

export default Logo
