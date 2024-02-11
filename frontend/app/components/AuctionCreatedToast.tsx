import { Auction } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  auction: Auction
}

const AuctionCreatedToast = ({ auction }: Props) => {
  const { id, imageUrl, make, model } = auction

  return (
    <Link
      href={`/auctions/details/${id}`}
      className='flex flex-col items-center'
    >
      <div className='flex flex-row items-center gap-2'>
        <Image
          src={imageUrl}
          alt='image'
          height={80}
          width={80}
          className='rounded-lg w-auto h-auto'
        />
        <span>
          New Action! {make} {model} has been added
        </span>
      </div>
    </Link>
  )
}

export default AuctionCreatedToast
