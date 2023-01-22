import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

interface ProductItem {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

interface Product {
  items: ProductItem[]
  filters: AppliedFilters
  selectedTab: string
}

interface AppliedFilters {
  title: string
  price: number
  stock: number
  brand?: string
  category?: string
}

const Products: React.FC<Product> = ({ items, selectedTab }) => {
  const [search, setSearch] = useState('')
  const [appliedFilters] = useState({})

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    saveSearch()
  }

  const saveSearch = () => {
    const searchParams = queryString.parse(window.location.search)
    searchParams.search = search
    window.history.pushState(
      {},
      '',
      `${window.location.pathname}?${queryString.stringify(searchParams)}`
    )
  }

  const filteredItems = items.filter((item) => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      Object.entries(appliedFilters).every(
        ([key, value]) => item[key as keyof ProductItem] === value
      )
    )
  })

  useEffect(() => {
    const searchParams = queryString.parse(window.location.search)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (searchParams.search) {
      const searchParams = new URLSearchParams(window.location.search)
      const searchValue = searchParams.get('search')
      setSearch(searchValue ?? '')
    }
  }, [])

  return (
    <div className=' min-w-full'>
      <div className='flex w-full justify-end pb-5'>
        <input
          className={selectedTab === 'carts' ? 'hidden' : 'block border border-gray-200 p-2'}
          type="text"
          placeholder="Search products"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <table className="border-collapse border border-slate-400 w-full">
        <thead>
          <tr>
            <th className="border border-slate-300">Product Name</th>
            <th className="border border-slate-300">Brand</th>
            <th className="border border-slate-300">Price</th>
            <th className="border border-slate-300">Stock</th>
            <th className="border border-slate-300">Category</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {filteredItems.map((item: ProductItem) => (
            <tr key={item.id} className="w-full">
              <td className="border border-slate-300">{item.title}</td>
              <td className="border border-slate-300">{item.brand}</td>
              <td className="border border-slate-300">{item.price}</td>
              <td className="border border-slate-300">{item.stock}</td>
              <td className="border border-slate-300">{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Index () {
  const [selectedTab, setSelectedTab] = useState<string>('products')
  const [isBarOpen, setIsBarOpen] = useState<boolean>(false)
  const itemsPerPage = 10
  const [data, setData] = useState<ProductItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedData = data.slice(startIndex, endIndex)
  const [filters] = useState<AppliedFilters>({
    title: '',
    price: 0,
    stock: 0,
    brand: '',
    category: ''
  })

  const closeMenu = () => {
    setIsBarOpen(false)
  }

  const openMenu = () => {
    setIsBarOpen(true)
  }

  const MenuBar = () => {
    return (
    <div className={isBarOpen ? 'flex flex-col bg-gray-200 border-r border-black pt-10 pl-5 md:pl-10 space-y-10 text-xl cursor-pointer fixed top-0 w-full h-full' : 'hidden'}>
    <div className={isBarOpen ? 'self-start' : 'hidden'}>
      <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
    </div>
    <div className="flex flex-row w-full pt-10">
      <div
        className={` ${
          selectedTab === 'products'
            ? 'h-10 w-1.5 flex items-center justify-center bg-purple-600 mr-5'
            : 'mr-6'
        }`}
      ></div>
      <b
        className={selectedTab === 'products' ? 'text-purple-600' : ''}
        onClick={() => {
          setSelectedTab('products')
        }}
      >
        Products
      </b>
    </div>
    <div className="flex flex-row">
      <div
        className={` ${
          selectedTab === 'carts'
            ? 'h-10 w-1.5 flex items-center justify-center bg-purple-600 mr-5'
            : 'mr-6'
        }`}
      ></div>
      <b
        className={selectedTab === 'carts' ? 'text-purple-600 mt-2' : ''}
        onClick={() => {
          setSelectedTab('carts')
        }}
      >
        Carts
      </b>
    </div>
  </div>
    )
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const callAPI = async () => {
    try {
      const res = await fetch('https://dummyjson.com/products')
      const data = await res.json()
      setData(data.products)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    void callAPI()
  }, [])

  const Carts = () => {
    return (
      <div className={selectedTab === 'products' ? 'hidden' : 'block'}>
        <p>Cart 1</p>
        <p className='pt-4'>Details</p>
        <div className='border border-black bg-gray-200 flex flex-row p-5 gap-20'>
          <div>
            <p>User: Test</p>
            <p>Added On: 20 Jan 2022</p>
          </div>
          <div>
            <p># of items: 5</p>
            <p>Total Amount: 50000</p>
          </div>
        </div>
    </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-full max-w-screen-lg">
      <MenuBar />
      <div className='md:hidden pt-10 pl-5 self-start'>
        <FontAwesomeIcon icon={faBars} onClick={openMenu} />
      </div>
      <div className="md:flex flex-col w-1/4 h-screen bg-gray-200 border-r border-black pt-20 pl-10 space-y-10 text-xl cursor-pointer hidden">
        <div className="flex flex-row w-full">
          <div
            className={` ${
              selectedTab === 'products'
                ? 'h-10 w-1.5 flex items-center justify-center bg-purple-600 mr-5'
                : 'mr-6'
            }`}
          ></div>
          <b
            className={selectedTab === 'products' ? 'text-purple-600' : ''}
            onClick={() => {
              setSelectedTab('products')
            }}
          >
            Products
          </b>
        </div>
        <div className="flex flex-row">
          <div
            className={` ${
              selectedTab === 'carts'
                ? 'h-10 w-1.5 flex items-center justify-center bg-purple-600 mr-5'
                : 'mr-6'
            }`}
          ></div>
          <b
            className={selectedTab === 'carts' ? 'text-purple-600 mt-2' : ''}
            onClick={() => {
              setSelectedTab('carts')
            }}
          >
            Carts
          </b>
        </div>
      </div>
      <div className="h-full p-3 md:p-10 flex flex-col w-full">
        <Carts />
        <Products items={displayedData} filters={filters} selectedTab={selectedTab} />
        <div className="h-full self-end flex flex-row space-x-5 pt-5">
          <button
          className=' bg-gray-300 border-2 border-black p-1.5'
            onClick={() => {
              handlePageChange(currentPage !== 1 ? currentPage - 1 : currentPage)
            }}
          >
            Previous
          </button>
          <p className=' self-center'>Page {currentPage} / 3</p>
          <button
          className=' bg-gray-300 border-2 border-black p-1.5'
            onClick={() => {
              handlePageChange(currentPage !== 3 ? currentPage + 1 : currentPage)
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
