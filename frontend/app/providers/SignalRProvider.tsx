'use client'

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import React, { ReactNode, useEffect, useState } from 'react'
import { useAuctionStore } from '../hooks/useAuctionStore'
import { useBidStore } from '../hooks/useBidStore'
import { Auction, AuctionFinished, Bid } from '@/types'
import { User } from 'next-auth'
import toast from 'react-hot-toast'
import AuctionCreatedToast from '../components/AuctionCreatedToast'
import { getDetailedViewData } from '../actions/auctionActions'
import AuctionFinishedToast from '../components/AuctionFinishedToast'

type Props = {
  children: ReactNode
  user: User | null
}

const SignalRProvider = ({ children, user }: Props) => {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice)
  const addBid = useBidStore((state) => state.addBid)
  const apiURL =
    process.env.NODE_ENV === 'production'
      ? 'https://api.carsties.com'
      : process.env.NEXT_PUBLIC_NOTIFY_URL

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiURL!)
      .withAutomaticReconnect()
      .build()
    setConnection(newConnection)
  }, [apiURL])

  useEffect(() => {
    if (!connection) return
    connection
      .start()
      .then(() => {
        console.log('Connected to notification hub')
        connection.on('BidPlaced', (bid: Bid) => {
          console.log('Bid placed event received')
          if (bid.bidStatus.includes('Accepted')) {
            setCurrentPrice(bid.auctionId, bid.amount)
          }
          addBid(bid)
        })

        connection.on('AuctionCreated', (auction: Auction) => {
          if (user?.username !== auction.seller)
            return toast(<AuctionCreatedToast auction={auction} />, {
              duration: 10000,
            })
        })

        connection.on('AuctionFinished', (finishedAuction: AuctionFinished) => {
          const auction = getDetailedViewData(finishedAuction.auctionId)
          return toast.promise(
            auction,
            {
              loading: 'Loading',
              success: (auction) => (
                <AuctionFinishedToast
                  finishedAuction={finishedAuction}
                  auction={auction}
                />
              ),
              error: (err) => 'Auction finished!',
            },
            { success: { duration: 10000, icon: null } },
          )
        })
      })
      .catch((error) => console.log(error))

    return () => {
      connection.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, setCurrentPrice])

  return <>{children}</>
}

export default SignalRProvider
