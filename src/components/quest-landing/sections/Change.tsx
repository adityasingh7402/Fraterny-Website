import React from 'react'
import img from '../../../../public/changepic.png'
import { Link } from 'react-router-dom';

const Change = () => {
  return (
    <div className='p-4 flex flex-col gap-6 py-6'>
       <div>
            <p className='text-gray-500 mb-2 text-4xl font-normal font-["Gilroy-Regular"]'>next 15 min</p>
            <h1 className=' text-wrap tracking-tighter font-["Gilroy-Bold"] text-4xl font-normal'>Might Change You.</h1>
       </div>
        <div>
            <p className='text-gray-500 mb-[-10px] text-2xl font-normal font-["Gilroy-Regular"] pb-2'>Just me and your thoughts.</p>
            <h1 className='text-black font-["Gilroy-Bold"] text-2xl'>Give it a try, It<span className='font-["Gilroy-MediumItalic"]'>'</span>s free!</h1>
        </div>
        <div>
            <img
              src={img}
              alt='Change Illustration'
              className='w-full h-auto'
            />
        </div>
        <div className='w-full h-50 rounded-md bg-gray-400'/>
        <Link to="/assessment">
          <button className='flex py-4 p-2 text-white text-[24px] w-full items-center justify-center rounded-full bg-gradient-to-br from-sky-800 to-sky-400 border-2 border-blue-950 tracking-[-1.8px]'
          >
            <span  className= 'text-white text-2xl font-normal font-["Gilroy-Bold"]' style={{ letterSpacing: '-8%' }}>
              Analyse Me
            </span>
          </button>
        </Link>
    </div>
  )
}

export default Change