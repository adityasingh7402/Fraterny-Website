import React from 'react'
import img from '../../../../public/changepic.png'

const Change = () => {
  return (
    <div className='p-4 flex flex-col gap-6 py-6'>
       <div>
            <p className='text-gray-500' style={{ fontFamily: 'Gilroy-Regular', fontSize: '36px', fontWeight: 400 }}>Next 15mins</p>
            <h1 className='-mt-5' style={{ fontFamily: 'Gilroy-Bold', fontSize: '40px', fontWeight: 400 }}>Might Change You</h1>
       </div>
        <div>
            <p className='text-gray-500' style={{ fontFamily: 'Gilroy-Regular', fontSize: '24px', fontWeight: 400 }}>Just me and your thoughts!</p>
            <h1 className='text-black font-bold' style={{ fontFamily: 'Gilroy-Bold', fontSize: '24px', fontWeight: 400 }}>Give it a try, It`s free!</h1>
        </div>
        <div>
            <img
              src={img}
              alt='Change Illustration'
              className='w-full h-auto'
            />
        </div>
        <div className='w-full h-50 rounded-md bg-gray-400'/>
        <button className='flex py-4 p-2 text-white text-[24px] w-full items-center justify-center rounded-full'
        style={{ 
          background: 'linear-gradient(91.45deg, #001F60 1%, #1D99DF 101.13%)',
          border: '2px solid transparent',
         }}
        >
          <span style={{ letterSpacing: '-1.92%' }}>
            Analyse Me
          </span>
        </button>
    </div>
  )
}

export default Change