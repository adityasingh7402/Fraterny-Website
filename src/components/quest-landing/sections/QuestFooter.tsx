import React from 'react'
import img from '../../../../public/Vector.svg';
import { Facebook, Instagram, Youtube } from 'lucide-react';

function QuestFooter() {
  return (
    <div>
        <div className='flex-col items-start justify-start pl-6 pt-4 mb-4'>
            <div>
            <img src={img} alt="Quest Footer" className='h-12 w-18 pb-4' />
            </div>
            <div className="w-80 pb-5 justify-start text-gray-400 text-sm font-normal font-['Gilroy-Regular'] leading-none">
                Quest is a platform that helps you discover your hidden potential and unlock new opportunities. Join us on this journey of self-discovery and growth.
            </div>
            {/* social media icons in flex row */}
            <div className='flex space-x-4 pb-4'>
                <a href="#" aria-label="Facebook">
                    <Facebook className='h-6 w-6 text-blue-600' />
                </a>
                <a href="#" aria-label="Youtube">
                    <Youtube className='h-6 w-6 text-red-600' />
                </a>
                <a href="#" aria-label="Instagram">
                    <Instagram className='h-6 w-6 text-pink-600' />
                </a>
            </div>
            <div className=" flex justify-between w-full pr-10">
                <div className='flex-col gap-2 '>
                    <h2 className='text-[#00C077]'>Quick Links</h2>
                    <div className='flex flex-col gap-1'>
                        <a href="/assessment" className="text-[#292929] text-sm font-normal font-['Inter'] leading-tight">Analyze Me</a>
                        <a href="/" className="text-[#292929] text-sm font-normal font-['Inter'] leading-tight">Book the Villa</a>
                        <a href="/quest-dashboard" className="text-[#292929] text-sm font-normal font-['Inter'] leading-tight">Dashboard</a>
                    </div>
                </div>
                <div className='flex-col gap-2 '>
                    <h2 className='text-[#00C077]'>Quick Links</h2>
                    <div className='flex flex-col gap-1'>
                        <a href="/terms-of-use" className="text-[#292929] text-sm font-normal font-['Inter'] leading-tight">Terms of Use</a>
                        <a href="/privacy-policy" className="text-[#292929] text-sm font-normal font-['Inter'] leading-tight">Privacy Policy</a>
                    </div>
                </div>

            </div>

        </div>      
    </div>
  )
}

export default QuestFooter