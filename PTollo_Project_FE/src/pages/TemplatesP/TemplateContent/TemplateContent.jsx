// Desc: BoardContent component of the Board page
import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision,
  // closestCenter,
} from "@dnd-kit/core";
import { MouseSensor, TouchSensor } from "~/CustomLibraries/DndKitSensor";

import { arrayMove } from "@dnd-kit/sortable";

import Column from "./ListColumns/Column/Column";
import CardBoard from "./ListColumns/Column/ListCards/CardBoard/CardBoard";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlacehodelrCard } from "~/utils/formattersAZ";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

const TemplateContent = ({
  template,
  moveColumns,
  moveCardsInTheSameColumn,
  moveCardToDifferentColumn,
}) => {
  //Nếu dùng PointerSensor mắc định thì phải kết hợp thuộc tính CSS touch-action: none; ở những phần tử kéo thả - nhưng còn bug
  // const pointerSensor = useSensor(PointerSensor, {
  //yêu cầu khoảng cách tối thiểu 10px thì mới kích hoạt event, tránh trường hợp click nhầm
  //   activationConstraint: {
  //     distance: 10,
  //   },
  // });

  //yêu cầu chuột di chuyển 10px thì mới kích hoạt event, tránh trường hợp click nhầm
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  // Nhấn giữ 250ms và dung sai của cảm ứng (dễ hiểu là di chuyển/chênh lệch 5px) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  //Ưu tiên sử dụng 2 loại sensor MouseSensor và TouchSensor để trãi nghiệm tốt hơn trên mobile không bị bug
  const sensors = useSensors(mouseSensor, touchSensor);

  const [sortedColumns, setSortedColumns] = useState([]);

  //Cùng 1 thới điểm chỉ có thể kéo thả 1 column hoặc 1 card
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  //dùng để xác định xem đang kéo thả column hay card
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);
  useEffect(() => {
    setSortedColumns(template.columns);
  }, [template]);
  //Điểm va chạm cuối cùng (overId) khi kéo thả
  const lastOverId = useRef(null);
  //Tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    //Đoạn này cần lưu ý, nên dùng col.cards thay vì col.cardOrderIds vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới rồi mới update lại cardOrderIds mới cho column
    //include cardId để tìm ra xem cardId có chưa trong mảng cards id mới của column không
    //col.cards.map(card => card._id) trả về mảng mới gồm card id của card trong column
    //(col) => col.cards.map((card) tìm ra column có chứa card đó
    return sortedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };
  //Khởi tạo Function xử lý kéo thả card giữa các columns khác nhau (cập nhật lại state )
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCarData,
    triggerFrom
  ) => {
    //hành động thả card giữa 2 columns khác nhau
    setSortedColumns((prevColumns) => {
      //Tìm vị trí (index) của cái overCard trong column đích (nơi mà activCard sắp được thả vào)
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );
      //rect là vị trí của phần tử so với khung hình
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;

      //logic tính toán "cardIndex mới" (trên ỏ dưới của overCard) lấy chuẩn ra từ code của thư viện @dnd-kit/sortable
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;
      // cloneDeep để tạo ra mảng mới, tránh thay đổi trực tiếp mảng cũ
      // clone mảng SortedColumns cũ ra một cái mới để xử lý data roioif return - cập nhật lại SortedColumns mới
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );
      //column cũ
      if (nextActiveColumn) {
        // xóa card ở cái column active cũ (cũng có thể hiểu là column cũ , cái lúc mà kéo card ra khỏi để thả vào column mới)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        ); //trả về 1 object mới không chứa card đang kéo

        //thêm Placedholder card vào column cũ rỗng: kéo hết card không còn cài card nào thì sẽ thêm 1 cái card đặc biệt để giữ chỗ
        if (isEmpty(nextActiveColumn.cards)) {
          console.log("Empty Column");
          nextActiveColumn.cards = [generatePlacehodelrCard(nextActiveColumn)];
        }
        console.log("Next Active Column ", nextActiveColumn);

        //cập nhật lại cardOrderIds mới cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id // return mảng chưa card id
        );
      }
      //column mới
      if (nextOverColumn) {
        //Kiểm tra xem card đang kéo đã có trong column đích chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        //Thêm card vào column đích là overColumn theo vị trí index mới
        //splice: thêm phần tử vào mảng tại vị trí index mới nó thêm tại mảng hiện của nó
        // toSpliced: thêm phần tử vào mảng tại vị trí index mới nó thêm tại mảng mới nghĩa là return mảng mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          //Khi kéo thả card giữa 2 columns khác nhau thì phải update lại column cũ và column mới để tránh trường hợp kéo thả lần 1 không sao lần 2 khi kéo về column cũ thì nhảy vào trường hợp 2 là kéo thả cùng 1 column do id bị trùng
          { ...activeDraggingCarData, columnId: nextOverColumn._id }
        );

        //Xóa Placedholder card nếu có đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );

        //cập nhật lại cardOrderIds mới cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id // return mảng chưa card id
        );
      }
      // console.log("Next Columns ", nextColumns);
      //Nếu function này được gọi từ handleDragEnd nghĩa là kéo thả đã kết thúc thì lúc này xử lý gọi API để cập nhật lại vị trí card
      if (triggerFrom === "handleDragEnd") {
        //Gọi lên props function moveCardToDifferentColumn nằm ở component cha (board/_id.jsx) để cập nhật lại vị trí card
        // Phải dùng tới activeDragItemData.columnId hoặc tốt nhất là oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver và tới đây là state của card đã bị cập nhật một lần rồi.
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        );
      }

      return nextColumns;
    });
  };

  //Trigger khi bắt đầu kéo 1 phần tử (drag)
  // event: chứa thông tin về việc kéo thả
  // nếu data có chứa columnId thì đang kéo thả card còn không thì kéo thả column
  const handleDragStart = (event) => {
    // console.log("Drap start ", event);
    //Lấy id cột hoặc card đang kéo thả
    setActiveDragItemId(event?.active?.id);
    //Lấy loại cột hoặc card đang kéo thả
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    //Lấy data cột hoặc card đang kéo thả
    //Xử lý giữ chỗ khi đang kéo thả
    setActiveDragItemData(event?.active?.data?.current);

    //Nếu đang kéo card thì lưu lại column cũ của card đang kéo
    if (event?.active?.data?.current?.columnId) {
      //Lưu lại column cũ của card đang kéo
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  //Trigger trong quá trình kéo(drag) từ vùng này thả vào vùng drop kia (over)
  const handleDragOver = (event) => {
    //Không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    // console.log("Drap over ", event);
    //Còn nếu kéo card thì xử lý thêm để có thẻ kéo card qua lại giữ các columns
    const { active, over } = event;

    //Cần đảm bảo active hoặc over không tồn tại (khi kéo ra khỏi phạm vi container) thì không làm gì cả (tránh cash trang)
    if (!active || !over) return;

    //Bốc tách thông tin cần thiết từ active và over
    //activeDraggingCard là card đang được kéo
    //activeDraggingCarData <==> active.data.current
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCarData },
    } = active;
    //overCard: là cái card đang tương tác trên or dưới so với card được kéo ở trên (là card mà ta muốn thay đổi vị trí trên or dưới)
    const { id: overCardId } = over;

    //tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;
    if (activeColumn._id === overColumn._id) return;
    //Xử lý logic ở đây chỉ khi kéo card qua lại giữa các columns khác nhau , không làm gì khi kéo card trong cùng 1 column ban đầu
    //vì đây là đoạn xử lý lúc kéo (handleDragOver), còn  xử lý lúc kéo xong thì nó lại là vấn đề khác ở handleDragEnd
    if (activeColumn._id !== overColumn._id) {
      //prevColumns là columns trước khi kéo thả
      //hành động thả card giữa 2 columns khác nhau
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCarData,
        "handleDragOver"
      );
    }
  };
  //Trigger khi kéo thả kết thúc => hành động thả (drop)
  const handleDragEnd = (event) => {
    // console.log("Drap end ", event);
    const { active, over } = event;

    //Cần đảm bảo active hoặc over không tồn tại (khi kéo ra khỏi phạm vi container) thì không làm gì cả (tránh cash trang)
    if (!active || !over) return;
    //Xử lý kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //Bốc tách thông tin cần thiết từ active và over
      //activeDraggingCard là card đang được kéo
      //activeDraggingCarData <==> active.data.current
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCarData },
      } = active;
      //overCard: là cái card đang tương tác trên or dưới so với card được kéo ở trên (là card mà ta muốn thay đổi vị trí trên or dưới)
      const { id: overCardId } = over;

      //tìm 2 cái column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;

      //hành động thả card giữa 2 columns khác nhau
      //Phải dùng tới activeDraggingItemData.columnId or oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua handleDragOver thì state activeData sẽ bị cập nhật lại 1 lần rồi.
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //?hành động thả card giữa 2 columns khác nhau
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCarData,
          "handleDragEnd"
        );
      } else {
        //?hành động thả card trong cùng 1 column
        //Lấy ví trí cũ (từ oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (card) => card._id === activeDragItemId
        );
        //Lấy ví trí mới (từ overColumn)
        const newCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );

        // Mảng sau khi kéo thả
        //Dùng arrayMove của thư viện @dnd-kit/sortable để sắp xếp lại mảng card sau khi kéo thả như dùng với column
        const dndSortedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        const dndOrderedCardIds = dndSortedCards.map((card) => card._id); // mảng các card id mới
        // Mảng id cột sau khi kéo thả để upate lại data trên api
        // xử lý gọi API để cập nhật lại vị trí cột
        // const dndSortedCardIds = dndSortedCard.map((col) => col._id);
        // console.log("Dnd Sorted Card ", dndSortedCard);
        // console.log("Dnd Sorted Card Ids ", dndSortedCardIds);

        // Cập nhật lại state sortedCard sau khi đã kéo thả  để render lại UI
        //Vẫn gọi update State ở đây để render lại UI để tránh delay or Flickering giao diện lúc kéo thả cần chờ API trả về (small trick)
        setSortedColumns((prevColumns) => {
          // cloneDeep để tạo ra mảng mới, tránh thay đổi trực tiếp mảng cũ
          // clone mảng SortedColumns cũ ra một cái mới để xử lý data roioif return - cập nhật lại SortedColumns mới
          const nextColumns = cloneDeep(prevColumns);
          //tìm tới column đang thả card
          const targetColumn = nextColumns.find(
            (col) => col._id === overColumn._id
          );
          //cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          // ta biết const không thể thay đổi giá trị của biến nhưng ta có thể ghi đè giá trị của object trong const
          targetColumn.cards = dndSortedCards; // mảng object card mới
          targetColumn.cardOrderIds = dndOrderedCardIds; // mảng các card id mới
          //trả về mảng cards mới sau khi kéo thả
          return nextColumns;
        });
        //Gọi lên props function moveCardsInTheSameColumn nằm ở component cha (board/_id.jsx) để cập nhật lại vị trí card
        moveCardsInTheSameColumn(
          dndSortedCards,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id
        );
      }
    }
    //Xử lý kéo thả columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu cột active khác cột over thì mới thực hiện kéo thả nghĩa là thay đổi vị trí cột
      if (active.id !== over.id) {
        //Lấy ví trí cũ (từ active)
        const oldColumnIndex = sortedColumns.findIndex(
          (col) => col._id === active.id
        );
        //Lấy ví trí mới (từ over)
        const newColumnIndex = sortedColumns.findIndex(
          (col) => col._id === over.id
        );

        if (oldColumnIndex !== -1 && newColumnIndex !== -1) {
          // Mảng sau khi kéo thả
          //Dùng arrayMove của thư viện @dnd-kit/sortable để sắp xếp lại mảng columns sau khi kéo thả
          const dndSortedColumns = arrayMove(
            sortedColumns,
            oldColumnIndex,
            newColumnIndex
          );
          // Cập nhật lại state sortedColumns sau khi đã kéo thả  để render lại UI
          //Vẫn gọi update State ở đây để render lại UI để tránh delay or Flickering giao diện lúc kéo thả cần chờ API trả về (small trick)
          setSortedColumns(dndSortedColumns);
          // Mảng id cột sau khi kéo thả để upate lại data trên api
          //Gọi lên props function moveColumns nằm ở component cha (board/_id.jsx) để cập nhật lại vị trí cột
          moveColumns(dndSortedColumns);
        }
      }
    }
    //Reset lại các state khi kéo thả xong
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  /**
   * Animation khi thả (drop) phầ tử - Test bằng cách kéo thả trực tiếp và nhìn phần giư chỗ
   */
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };
  //args = arguments = các tham số, đối số
  const collisionDetectionStrategy = useCallback(
    (args) => {
      //nếu đang kéo thả column thì sẽ sử dụng thuật toán closestCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      //tìm điểm giao nhau va chạm - intersection với con trỏ
      const pointerIntersection = pointerWithin(args);

      if (!pointerIntersection?.length) return;
      //thuật toán xử lý va chạm và trả về 1 mảng các va chạm ở đây
      // const intersections =
      //   pointerIntersection?.length > 0
      //     ? pointerIntersection
      //     : rectIntersection(args);

      //tìm overId đầu tiền trên các intersections trên
      let overId = getFirstCollision(pointerIntersection, "id");

      if (overId) {
        //nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất trong khu vực va chạm đó dựa vào thuật toán phat hiển va chạm closestCorners or closestCenter đều được. Tuy nhiên dùng closestCorners sẽ muợt mà hơn
        const checkColumn = sortedColumns.find((col) => col._id === overId);
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                checkColumn?.cardOrderIds?.includes(container.id)
            ),
          })[0]?.id;
        }
        return [{ id: overId }];
      }

      //nếu overId không tồn tại thì trả về mảng rỗng
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, sortedColumns]
  );
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.Ptollo.boardContentHeight,
        position: "relative",
      }}>
      {/* Cột sau khi được thay đổi thứ tự kéo thả  */}
      <ListColumns columns={sortedColumns} />
    </Box>
  );
};
export default TemplateContent;
