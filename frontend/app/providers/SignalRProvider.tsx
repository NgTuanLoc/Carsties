'use client'

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import React, { ReactNode, useEffect, useState } from 'react'
import { useAuctionStore } from '../hooks/useAuctionStore'
import { useBidStore } from '../hooks/useBidStore'
import { Bid } from '@/types'

type Props = {
  children: ReactNode
}

const SignalRProvider = ({ children }: Props) => {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice)
  const addBid = useBidStore((state) => state.addBid)

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:6001/notifications')
      .withAutomaticReconnect()
      .build()
    setConnection(newConnection)
  }, [])

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
