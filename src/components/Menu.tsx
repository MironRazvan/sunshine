import { X } from 'lucide-react';
import React from 'react'
import { createPortal } from 'react-dom';

interface MenuProps {
    isOpen: boolean;
    anchorElement: HTMLElement | null;
    onClose: () => void;
    children: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({isOpen,anchorElement,onClose,children}) => {
    if (!isOpen || !anchorElement) return null

      return createPortal(
        <div onClick={(e) => e.stopPropagation()} className="absolute top-16 opacity-95 left-0 w-full px-2 bg-gray-500 flex flex-col items-start py-4 md:hidden transition-opacity">
          <div className='mx-2 my-2 absolute right-2 left-auto top-2'>
            <button onClick={onClose} >
                <X className='text-gray-50'/>
            </button>
          </div>
          {children}
        </div>,
        document.body
      );
}

export default Menu
