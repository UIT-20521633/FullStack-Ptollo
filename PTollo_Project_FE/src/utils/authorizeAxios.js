import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formattersAZ";
import { refreshTokenAPI } from "~/apis";
import { logoutUserAPI } from "~/redux/user/userSlice";

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường như các file jsx component
 * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi react component như file authorizeAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
//Biến axiosReduxStore sẽ chứa redux store của ứng dụng, cục bộ của file này
let axiosReduxStore;
export const injectStore = (mainStore) => (axiosReduxStore = mainStore);

//Khởi tạo 1 đối tượng axios (authorizedAxiosInstance) mục đích là để custom và cấu hình dự án
let authorizedAxiosInstance = axios.create();
//Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;
//withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh token hay access token) vào trong httpOnly cookie của trình duyệt
authorizedAxiosInstance.defaults.withCredentials = true;

/**
 * Cấu hình Interceptor (Bộ đánh chặn giữa mọi request và response)
 */
//Interceptor Request: Can thiệt vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    //Kỹ thuật chặn spam click (xem kỹ mô tả ở flie formattersAZ.js)
    interceptorLoadingElements(true);
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

//Khởi tạo 1 promise cho việc gọi Api refresh token
//Mục đích tạo promise này để khi gọi api refresh token xong thì mới retry lại nhiều api bị lỗi trước đó
// (vì khi gọi api refresh token xong thì mới có thể lấy được token mới để gọi lại các api bị lỗi trước đó)
//Nếu không có promise này thì sẽ bị lỗi vòng lặp vô hạn khi gọi api refresh token xong thì lại gọi api refresh token tiếp tục vô hạn
let refreshTokenPromise = null; //flag để kiểm tra xem có đang gọi api refresh token hay không

//Interceptor Response: Can thiệt vào giữa những cái response nhận về
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    //Kỹ thuật chặn spam click (xem kỹ mô tả ở flie formattersAZ.js)
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    //Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

    //Kỹ thuật chặn spam click (xem kỹ mô tả ở flie formattersAZ.js)
    interceptorLoadingElements(false);

    /**Quan trọng: xử lý refresh token tự động */
    //TH1: Nếu như mã lỗi là 401 - Unauthorized từ BE (có thể hiểu là token hết hạn hoặc không hợp lệ) => gọi API đăng xuất luôn
    if (error?.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false));
    }

    //TH2: Nếu như mã lỗi là 410 - GONE từ BE thì sẽ gọi api refresh token để làm mới access token
    //Đầu tiên lấy được các request đang bị lỗi thông qua error.config
    const originalRequest = error.config;
    if (error?.response?.status === 410 && originalRequest) {
      //Gán thêm 1 giá trị _retry luôn = true trong khoảng thời gian chờ để tránh việc lặp vô hạn khi gọi lại api refresh token (đảm bảo chỉ gọi 1 lần)
      originalRequest._retry = true;

      //Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh token đồng thời gán vào refreshTokenPromise để tránh việc gọi lại nhiều lần
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            /**
             * Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
             * Hiện tại ở đây không cần làm gì vì đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
             */
            return data?.accessToken;
          })
          .catch((_error) => {
            //Nếu nhận bất kì lỗi nào từ api refresh token thì logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false));
            //Fix lỗi bị gọi 2 lần API Logout nếu như rơi vào trường hợp khi API refresh token trả về lỗi
            return Promise.reject(_error);
          })
          .finally(() => {
            //Dù thành công hay thất bại thì cũng phải gán refreshTokenPromise = null để cho lần gọi tiếp theo
            refreshTokenPromise = null;
          });
      }
      //cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        /**
         * Case 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
         * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
         */

        // Case 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi (ví dụ như các api board đang lỗi xong nó sẽ tự gọi lại các api board đó sau khi refreshToken thành công)
        return authorizedAxiosInstance(originalRequest);
      });
    }

    //Xử lý tập trung phần hiển thị thông báo trả về từ mọi API ở đây (xử lý tập trung ở 1 chỗ clean code)
    // console.log(error) ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
    console.log("error", error);
    let errorMessage = error?.message;
    if (error?.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }
    //Dùng toastify để hiển thị thông báo lỗi lên màn hình - ngoại trừ mã 410 - GONE (có thể hiểu là dữ liệu đã bị xóa) phục vụ việc tự refresh lại token
    if (error?.response?.status !== 410) {
      toast.error(errorMessage);
    }

    //Trả về 1 Promise reject với lỗi là message lỗi
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
