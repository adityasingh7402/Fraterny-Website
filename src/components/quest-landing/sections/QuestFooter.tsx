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
            <div className='flex space-x-4'>
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

        </div>      
    </div>
  )
}

export default QuestFooter