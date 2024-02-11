import { Auction, AuctionFinished } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { numberWithCommas } from '@/lib/numberWithComma'

type Props = {
  auction: Auction
  finishedAuction: AuctionFinished
}

const AuctionFinishedToast = ({ auction, finishedAuction }: Props) => {
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
          Auction for {make} {model} has finished
        </span>
        {finishedAuction.itemSold && finishedAuction.amount ? (
          <p>
            Congrats to {finishedAuction.winner} who has won this auction for $$
            {numberWithCommas(finishedAuction.amount)}
          </p>
        ) : (
          <p>This item did not sell</p>
        )}
      </div>
    </Link>
  )
}

export default AuctionFinishedToast
