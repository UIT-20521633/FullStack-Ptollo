/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};
/**
 * Format a number to currency
 */

/**
 * Phía FE sẽ tự tạo 1 card đăc biệt để placeholder
 * Card này sẽ được ẩn ở giao diện UI người dùng
 * Cấu trúc Id của card này là Unique rất đơn giản, không cần random phức tạp:
 * "columnId-placeholder-card" (mỗi column chỉ có thể có tối đa 1 cái Placeholder card)
 * Quan trọng nhất là phải đầy đủ (-id, boardId, columnId, FE_PlaceholderCard) để tránh trùng lặp với các card khác
 */
export const generatePlacehodelrCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};
// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-events để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// Cách sử dụng: Với tất cả các link hoặc button mà có hành động gọi api thì thêm class "interceptor-loading" cho nó là xong.
export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll(".interceptor-loading");
  // Duyệt qua từng phần tử do trên page có thể có nhiều phần tử cần chặn ví dụ là button AddNewCard, Add
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = "0.5";
      elements[i].style.pointerEvents = "none";
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = "initial";
      elements[i].style.pointerEvents = "initial";
    }
  }
};
