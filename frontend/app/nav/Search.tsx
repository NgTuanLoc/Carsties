'use client'
import { FaSearch } from 'react-icons/fa'
import { useParamsStore } from '../hooks/useParamsStore'
import { usePathname, useRouter } from 'next/navigation'

const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const setParams = useParamsStore((state) => state.setParams)
  const searchValue = useParamsStore((state) => state.searchValue)
  const setSearchValue = useParamsStore((state) => state.setSearchValue)

  const onChangeHandler = (event: any) => {
    setSearchValue(event.target.value)
  }

  const onSearchHandler = () => {
    if (pathname !== '/') router.push('/')
    setParams({ searchTerm: searchValue })
  }

  return (
    <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
      <input
        className='flex-grow pl-5 bg-transparent focus:outline-none border-transparent focus:border-transparent focus:ring-0 text-sm text-gray-600'
        type='text'
        value={searchValue}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSearchHandler()
        }}
        onChange={onChangeHandler}
        placeholder='Search for cars by make, model or color'
      />
      <button onClick={onSearchHandler}>
        <FaSearch
          size={34}
          className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2'
        />
      </button>
    </div>
  )
}

export default Search
