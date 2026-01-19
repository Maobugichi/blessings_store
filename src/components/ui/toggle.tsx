import type { SetStateAction } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";


interface ToggleButtonProps {
    showBalance:boolean ,
    setShowBalance: React.Dispatch<SetStateAction<boolean>> 
}

const ToggleButton = ({showBalance , setShowBalance}:ToggleButtonProps) => {

    const toggleBalance = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowBalance((prev) => !prev);
    };
    return(
         <button
            onClick={toggleBalance} 
            className="p-1 absolute  right-5 top-16 z-20 text-gray-600 hover:text-gray-900 transition"
            title={showBalance ? "Hide balance" : "Show balance"}
            type="button" 
        >
            {showBalance ? (
                <HiEye className="text-gray-500" size={18} />
            ) : (
                
                <HiEyeOff className="text-gray-500" size={18} />
            )}
        </button>
    )
}

export default ToggleButton