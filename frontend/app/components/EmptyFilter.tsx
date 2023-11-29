'use client'

import React from 'react'
import Heading from './Heading'
import { Button } from 'flowbite-react'
import { useParamsStore } from '../hooks/useParamsStore'

type Props = {
  title?: string
  subtitle?: string
  showReset?: boolean
  showLogin?: boolean
  callbackUrl?: string
}

export default function EmptyFilter({
  title = 'No matches for this filter',
  subtitle = 'Try changing or resetting the filter',
  showReset,
  showLogin,
}: Props) {
  const reset = useParamsStore((state) => state.reset)

  return (
    <div className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'>
      <Heading title={title} subtitle={subtitle} center />
      <div className='mt-4'>
        {showReset && (
          <Button outline onClick={reset}>
            Remove Filters
          </Button>
        )}
        {showLogin && <Button outline>Login</Button>}
      </div>
    </div>
  )
}
