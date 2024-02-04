'use client'

import { User } from 'next-auth'
import Link from 'next/link'
import { Dropdown } from 'flowbite-react'
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai'
import { HiCog, HiUser } from 'react-icons/hi2'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useParamsStore } from '../hooks/useParamsStore'

type Props = {
  user: Partial<User>
}

const UserActions = ({ user }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const setParams = useParamsStore((state) => state.setParams)

  const setWinner = () => {
    setParams({ winner: user.username, seller: undefined })
  }

  const setSeller = () => {
    setParams({ seller: user.username, winner: undefined })
    if (pathname !== '/') router.push('/')
  }

  return (
    <Dropdown inline label={`Welcome ${user.name}`}>
      <Dropdown.Item icon={HiUser} onClick={setSeller}>
        My Auctions
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillTrophy} onClick={setWinner}>
        Auctions won
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillCar}>
        <Link href='/auctions/create'>Sell my car</Link>
      </Dropdown.Item>
      <Dropdown.Item icon={HiCog}>
        <Link href='/session'>Session (dev only)</Link>
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        icon={AiOutlineLogout}
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign out
      </Dropdown.Item>
    </Dropdown>
  )
}

export default UserActions
