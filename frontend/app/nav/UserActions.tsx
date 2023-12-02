import { Button } from 'flowbite-react'
import Link from 'next/link'

const UserActions = () => {
  return (
    <Button outline>
      <Link href='/session'>Session</Link>
    </Button>
  )
}

export default UserActions
