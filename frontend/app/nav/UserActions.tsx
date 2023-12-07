'use client'

import { User } from 'next-auth'
import Link from 'next/link'
import { Dropdown } from 'flowbite-react'
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai'
import { HiCog, HiUser } from 'react-icons/hi2'
import { signOut } from 'next-auth/react'

type Props = {
  user: Partial<User>
}

const UserActions = ({ user }: Props) => {
  return (
    <Dropdown inline label={`Welcome ${user.name}`}>
      <Dropdown.Item icon={HiUser}>My Auctions</Dropdown.Item>
      <Dropdown.Item icon={AiFillTrophy}>Auctions won</Dropdown.Item>
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
