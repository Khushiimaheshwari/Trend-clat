import { useEffect } from "react";
import PropTypes from "prop-types";
import { CheckCircle, XCircle, AlertTriangle, Info, ShieldCheck } from "lucide-react";

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); 

        return () => clearTimeout(timer);
    }, [onClose]);

    const typeStyles = {
        success: { bg: "bg-green-500", icon: <CheckCircle size={24} className="text-white" /> },
        error: { bg: "bg-red-500", icon: <XCircle size={24} className="text-white" /> },
        warning: { bg: "bg-yellow-500", icon: <AlertTriangle size={24} className="text-white" /> },
        info: { bg: "bg-blue-500", icon: <Info size={24} className="text-white" /> },
        confirmation: { bg: "bg-purple-500", icon: <ShieldCheck size={24} className="text-white" /> },
    };

    return (
        <div className="fixed z-20 top-4 left-1/2 transform -translate-x-1/2 flex text-center items-center shadow-md rounded-xl bg-white border border-gray-200 w-auto">
            <div className={`p-4 ${typeStyles[type].bg} rounded-l-xl flex items-center`}>
                {typeStyles[type].icon}
            </div>
            <div className="px-5 py-3 text-black text-center items-center font-medium sm:text-xs smd:text-sm md:text-base lg:text-lg">{message}</div>
        </div>
    );
};

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error", "warning", "info", "confirmation"]),
    onClose: PropTypes.func.isRequired
};

export default Notification;
