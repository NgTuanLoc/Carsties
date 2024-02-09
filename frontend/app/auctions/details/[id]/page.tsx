import {
  getBidsForAuction,
  getDetailedViewData,
} from '@/app/actions/auctionActions'
import Heading from '@/app/components/Heading'
import React from 'react'
import CountdownTimer from '../../CountDownTimer'
import CarImage from '../../CarImage'
import { DetailedSpecs } from './DetailedSpecs'
import { getCurrentUser } from '@/app/actions/authActions'
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'
import BidItem from './BidItem'
import BidList from './BidList'

const Details = async ({ params }: { params: { id: string } }) => {
  const data = await getDetailedViewData(params.id)
  const user = await getCurrentUser()
  const bids = await getBidsForAuction(params.id)
  const { make, model, auctionEnd, imageUrl } = data

  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex items-center gap-3'>
          <Heading title={`${make} ${model}`} />
          {user?.username === data.seller && (
            <>
              <EditButton id={params.id} />
              <DeleteButton id={params.id} />
            </>
          )}
        </div>
        <div>
          <h3 className='text-2xl font-semibold'>Time remaining:</h3>
          <CountdownTimer auctionEnd={auctionEnd} />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-6 mt-3'>
        <div className='w-full bg-gray-200 aspect-h-10 aspect-w-16 rounded-lg overflow-hidden'>
          <CarImage imageUrl={data.imageUrl} />
        </div>
        <BidList user={user} auction={data} />
      </div>
      <div
        className='mt-3
       grid grid-cols-1 rounded-lg'
      >
        <DetailedSpecs auction={data} />
      </div>
    </div>
  )
}

export default Details
