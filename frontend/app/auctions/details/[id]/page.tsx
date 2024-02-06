import { getDetailedViewData } from '@/app/actions/auctionActions'
import Heading from '@/app/components/Heading'
import React from 'react'
import CountdownTimer from '../../CountDownTimer'
import CarImage from '../../CarImage'
import { DetailedSpecs } from './DetailedSpecs'

const Details = async ({ params }: { params: { id: string } }) => {
  const data = await getDetailedViewData(params.id)
  const { make, model, auctionEnd, imageUrl } = data

  return (
    <div>
      <div className='flex justify-between'>
        <Heading title={`${make} ${model}`} />
        <div>
          <h3 className='text-2xl font-semibold'>Time remaining:</h3>
          <CountdownTimer auctionEnd={auctionEnd} />
        </div>
      </div>
      <div className='grid grid-cols-3 gap-6 mt-3'>
        <div className='w-full bg-gray-200 aspect-h-10 aspect-w-16 rounded-lg overflow-hidden'>
          <CarImage imageUrl={imageUrl} />
        </div>
        <div className='border-2 rounded-lg p-2 bg-gray-100'>
          <Heading title='Bids' />
        </div>
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
