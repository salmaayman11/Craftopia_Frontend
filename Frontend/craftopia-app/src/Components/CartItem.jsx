import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const handleDecrease = () => {
    if (item.cartQuantity > 1) {
      onQuantityChange('dec');
    }
  };

  const handleIncrease = () => {
    if (item.cartQuantity < item.stockQuantity) {
      onQuantityChange('inc');
    }
  };

  const reachedMax = item.cartQuantity >= item.stockQuantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 gap-3 sm:gap-0">
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <img
          src={item.image[0]}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.name}</h2>
          <span className="inline-block bg-[#ebaeb873] text-[#000000] text-xs font-semibold px-2 sm:px-3 py-1 rounded-full mt-1">
            {item.category}
          </span>

          <p className="text-base sm:text-lg font-bold text-gray-900 mt-1">
            ${(item.price * item.cartQuantity).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={item.cartQuantity <= 1}
            className={`p-2 sm:p-2 rounded-md transition-colors duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${
              item.cartQuantity <= 1 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-600 hover:text-red-700 hover:bg-red-50"
            }`}
          >
            <FiMinus size={18} className="sm:w-5 sm:h-5" />
          </button>

          <span className="px-3 py-1 bg-gray-100 rounded-md min-w-[40px] text-center font-semibold text-sm sm:text-base">
            {item.cartQuantity}
          </span>

          <button
            onClick={handleIncrease}
            disabled={reachedMax}
            className={`p-2 sm:p-2 rounded-md transition-colors duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${
              reachedMax 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-600 hover:text-green-700 hover:bg-green-50"
            }`}
            title={reachedMax ? "Maximum stock reached" : ""}
          >
            <FiPlus size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <button 
          onClick={() => onRemove(item.id)} 
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <FiTrash2 size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
