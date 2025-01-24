import { useState, useEffect } from "react";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from "@mui/material/Grid2";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
// import CardMedia from '@mui/material/CardMedia'
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Link, useLocation } from "react-router-dom";
import randomColor from "randomcolor";
import { fetchBoardsAPI } from "~/apis";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import {
  DEFAULT_PAGE,
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_ITEMS_PER_PAGE_STARRED,
} from "~/utils/constants";
import SidebarCreateBoardModal from "./create";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentBoardsAPI,
  fetchStarredBoardsAPI,
  selectRecentlyViewedBoards,
  selectStarredBoards,
} from "~/redux/user/userSlice";
import CardComponentBoard from "~/components/Card/CardComponentBoard";
import { fetchCompletionBoardAPI } from "~/redux/activeBoard/activeBoardSlice";

function Boards() {
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null);
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null);
  const [starredPage, setStarredPage] = useState(1); // Theo dõi trang hiện tại của Starred Boards

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation();

  //Lấy danh sách boards đã xem gần đây
  const dispatch = useDispatch();
  const recentlyViewedBoards = useSelector(selectRecentlyViewedBoards);
  const starredBoards = useSelector(selectStarredBoards);
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search);
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get("page") || "1", 10);

  const updateStateData = (res) => {
    setBoards(res.boards || []);
    setTotalBoards(res.totalBoards || 0);
  };

  useEffect(() => {
    // // Fake tạm 16 cái item thay cho boards
    // // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // setBoards([...Array(16)].map((_, i) => i));
    // // Fake tạm giả sử trong Database trả về có tổng 100 bản ghi boards
    // setTotalBoards(100)
    // Mỗi khi cái url thay đổi ví dụ như chúng ta chuyển trang, thì cái location.search lấy từ hook useLocation của react-router-dom cũng thay đổi theo, đồng nghĩa hàm useEffect sẽ chạy lại và fetch lại API theo đúng page mới vì cái localtion.search đã nằm trong dependencies của useEffect
    // console.log(location.search)
    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search).then(updateStateData);
  }, [location.search]);
  const afterCreateNewBoard = () => {
    // Đơn giản là cứ fetch lại danh sách board tương tự trong useEffect (f5 lại trang)
    fetchBoardsAPI(location.search).then(updateStateData);
  };
  useEffect(() => {
    dispatch(fetchStarredBoardsAPI()); // Gọi API lấy danh sách Starred Boards;
    dispatch(fetchRecentBoardsAPI()); // Gọi API lấy danh sách Recently Viewed Boards;
  }, [dispatch, page, starredPage]);
  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />;
  }

  // Tính toán danh sách Starred Boards cho trang hiện tại
  //slice: cắt mảng từ vị trí bắt đầu đến vị trí kết thúc
  //Ví dụ: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].slice(0, 5) => [0, 1, 2, 3, 4]
  const starredBoardsForPage = starredBoards.slice(
    (starredPage - 1) * DEFAULT_ITEMS_PER_PAGE_STARRED,
    starredPage * DEFAULT_ITEMS_PER_PAGE_STARRED
  );
  return (
    <Container disableGutters maxWidth={false}>
      {/* Button tạo board  */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pl: 2,
          pt: 2,
          width: "25%",
        }}>
        <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
        <Divider />
      </Box>
      <Box
        sx={{
          paddingX: 2,
          my: 4,
          display: "flex",
          flexDirection: "column",
        }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Starred Boards */}
          {starredBoards.length > 0 && (
            <Grid xs={12} sm={9}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                <StarBorderRoundedIcon
                  sx={{
                    fontSize: 28,
                    fontWeight: "900",
                    mx: 1,
                  }}
                />
                Starred boards:
              </Typography>
              <Grid container spacing={2}>
                {starredBoardsForPage.map((b) => (
                  <Grid xs={2} sm={3} md={4} key={b.boardId}>
                    <CardComponentBoard
                      boardId={b.boardId}
                      title={b.board?.title}
                      description={b.board?.description}
                      background={b.board?.background}
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Phân trang cho Starred Boards */}
              {starredBoards.length > DEFAULT_ITEMS_PER_PAGE_STARRED && (
                <Box
                  sx={{
                    my: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}>
                  <Pagination
                    size="large"
                    color="secondary"
                    showFirstButton
                    showLastButton
                    count={Math.ceil(
                      starredBoards.length / DEFAULT_ITEMS_PER_PAGE_STARRED
                    )}
                    page={starredPage}
                    onChange={(event, value) => setStarredPage(value)}
                  />
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {/* Recently Viewed Boards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {recentlyViewedBoards.length > 0 && (
            <Grid xs={12} sm={9}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                <AccessTimeOutlinedIcon
                  sx={{
                    fontSize: 28,
                    fontWeight: "900",
                    mx: 1,
                  }}
                />
                Recently Viewed:
              </Typography>
              <Grid container spacing={2}>
                {recentlyViewedBoards.map((b) => (
                  <Grid xs={2} sm={3} md={4} key={b.boardId}>
                    <CardComponentBoard
                      boardId={b.boardId}
                      title={b.board?.title}
                      description={b.board?.description}
                      background={b.board?.background}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid container spacing={2}>
          {/* Your Board */}
          <Grid xs={12} sm={9}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              <AccountBoxOutlinedIcon
                sx={{ fontSize: 28, fontWeight: "900", mx: 1 }}
              />
              Your boards:
            </Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 && (
              <Typography variant="span" sx={{ fontWeight: "bold", mb: 3 }}>
                No result found!
              </Typography>
            )}

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 && (
              <Grid container spacing={2}>
                {boards.map((b) => (
                  <Grid xs={2} sm={3} md={4} key={b._id}>
                    <CardComponentBoard
                      boardId={b._id}
                      title={b.title}
                      description={b.description}
                      background={b.background}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {totalBoards > 0 && (
              <Box
                sx={{
                  my: 3,
                  pr: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page}
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? "" : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Boards;
