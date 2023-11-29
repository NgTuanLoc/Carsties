import { Button, ButtonGroup } from 'flowbite-react'
import { AiOutlineClockCircle, AiOutlineSortAscending } from 'react-icons/ai'
import { BsFillStopCircleFill, BsStopwatchFill } from 'react-icons/bs'
import { GiFinishLine, GiFlame } from 'react-icons/gi'
import { useParamsStore } from '../hooks/useParamsStore'

const orderButtons = [
  {
    label: 'Alphabetical',
    icon: AiOutlineSortAscending,
    value: 'make',
  },
  {
    label: 'End date',
    icon: AiOutlineClockCircle,
    value: 'endingSoon',
  },
  {
    label: 'Recently added',
    icon: BsFillStopCircleFill,
    value: 'new',
  },
]

const filterButtons = [
  {
    label: 'Live Auctions',
    icon: GiFlame,
    value: 'live',
  },
  {
    label: 'Ending < 6 hours',
    icon: GiFinishLine,
    value: 'endingSoon',
  },
  {
    label: 'Completed',
    icon: BsStopwatchFill,
    value: 'finished',
  },
]

const pageSizeButtons = [4, 8, 12]

const Filters = () => {
  const pageSize = useParamsStore((state) => state.pageSize)
  const setParams = useParamsStore((state) => state.setParams)
  const orderBy = useParamsStore((state) => state.orderBy)
  const filterBy = useParamsStore((state) => state.filterBy)

  return (
    <div className='flex justify-between items-center mb-4'>
      <div>
        <span className='uppercase text-sm text-gray-500 mr-2'>Filter by</span>
        <Button.Group>
          {filterButtons.map(({ label, icon: Icon, value }) => (
            <Button
              key={value}
              onClick={() => setParams({ filterBy: value })}
              color={`${filterBy === value ? 'red' : 'gray'}`}
            >
              <Icon className='mr-3 h-4 w-4' />
              {label}
            </Button>
          ))}
        </Button.Group>
      </div>

      <div>
        <span className='uppercase text-sm text-gray-500 mr-2'>Order by</span>
        <ButtonGroup>
          {orderButtons.map(({ label, icon: Icon, value }) => (
            <Button
              key={value}
              onClick={() => setParams({ orderBy: value })}
              color={`${orderBy === value ? 'red' : 'gray'}`}
            >
              <Icon className='mr-3 h-4 w-4' />
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div>
        <span className='uppercase text-sm text-gray-500 mr-2'>Page size</span>
        <ButtonGroup>
          {pageSizeButtons.map((value, i) => {
            return (
              <Button
                color={`${pageSize === value ? 'red' : 'gray'}`}
                key={i}
                className='focus:ring-0'
                onClick={() => setParams({ pageSize: value })}
              >
                {value}
              </Button>
            )
          })}
        </ButtonGroup>
      </div>
    </div>
  )
}

export default Filters
