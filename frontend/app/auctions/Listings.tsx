'use client'
import { useEffect, useState } from 'react'
import qs from 'query-string'
import { useShallow } from 'zustand/react/shallow'
import AuctionCard from './AuctionCard'
import Filters from './Filters'
import { useParamsStore } from '../hooks/useParamsStore'
import AppPagination from '../components/AppPagination'
import { getData } from '../actions/auctionActions'
import EmptyFilter from '../components/EmptyFilter'
import { useAuctionStore } from '../hooks/useAuctionStore'

const Listings = () => {
  const [loading, setLoading] = useState(true)
  const data = useAuctionStore(
    useShallow((state) => ({
      auctions: state.auctions,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    })),
  )
  const setData = useAuctionStore((state) => state.setData)
  const params = useParamsStore(
    useShallow((state) => ({
      searchTerm: state.searchTerm,
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      seller: state.seller,
      winner: state.winner,
    })),
  )
  const setParams = useParamsStore((state) => state.setParams)
  const url = qs.stringifyUrl({ url: '', query: params })

  const setPageNumber = (pageNumber: number) => {
    setParams({ pageNumber })
  }

  useEffect(() => {
    getData(url).then((data) => {
      setData(data)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  if (!data) return <h3>Loading...</h3>

  if (!data.auctions.length)
    return (
      <>
        <Filters />
        <EmptyFilter showReset />
      </>
    )

  return (
    <>
      <Filters />
      <div className='grid grid-cols-4 gap-6'>
        {data.auctions.map((item) => (
          <AuctionCard key={item.id} auction={item} />
        ))}
      </div>
      <div className='flex justify-center mt-4'>
        <AppPagination
          currentPage={params.pageNumber}
          pageCount={data.pageCount}
          pageChanged={setPageNumber}
        />
      </div>
    </>
  )
}

export default Listings
