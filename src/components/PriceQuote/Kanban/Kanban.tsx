import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { VscSettings } from "react-icons/vsc";
import usePostData from "@/hooks/usePostData";
import { IGetPriceQuote } from "@/models/priceQuoteInterface";
import { fetchPriceQuotes } from "@/redux/store/slices/priceQuoteSlices/get_price_quotes.slice";
import priceQuoteService from "@/services/priceQuoteService";

const Kanban = () => {
  const [columns, setColumns] = useState<
    { status: string; data: IGetPriceQuote[] }[]
  >([]);
  const statuss = ["draff", "send", "open", "edit", "refuse", "accept"];
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchPriceQuotes({}));
  }, []);
  const { datas: dataPriceQuotes } = useSelector(
    (state: RootState) => state.get_price_quotes
  );
  useEffect(() => {
    // setColumns(dataPriceQuotes ?? []);
    if (dataPriceQuotes) {
      const dataRes = statuss.map((dt) => {
        const dtPriceQuote = dataPriceQuotes.filter((dtt) => dtt.status === dt);
        return { status: dt, data: dtPriceQuote };
      });
      setColumns(dataRes);
    }
  }, [dataPriceQuotes]);
  // useEffect(() => {
  //   console.log(columns);
  // }, [columns]);
  const handleChange = async (
    datas: { status: string; data: IGetPriceQuote[] }[]
  ) => {
    const dataReq = datas
      .map((dt) =>
        dt.data.map((dtt) => {
          return {
            price_quote_id: dtt.price_quote_id,
            status: dt.status,
            // position: index + 1,
          };
        })
      )
      .flat();
    const statusCode = await postdata(() =>
      priceQuoteService.updateStatusListPriceQuote(dataReq)
    );
    if (statusCode === 200) {
      dispatch(fetchPriceQuotes({}));
    }
  };
  const onDragEnd = (
    result: DropResult,
    columns: { status: string; data: IGetPriceQuote[] }[],
    setColumns: React.Dispatch<
      React.SetStateAction<{ status: string; data: IGetPriceQuote[] }[]>
    >
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[Number(source.droppableId)];
      const destColumn = columns[Number(destination.droppableId)];
      const sourceItems = [...sourceColumn.data];
      const destItems = [...destColumn.data];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      // setColumns({
      //   ...columns,
      //   [source.droppableId]: {
      //     ...sourceColumn,
      //     activity: sourceItems,
      //   },
      //   [destination.droppableId]: {
      //     ...destColumn,
      //     activity: destItems,
      //   },
      // });
      setColumns((preValue: { status: string; data: IGetPriceQuote[] }[]) => {
        return preValue.map((dt, index) => {
          if (index === Number(source.droppableId)) {
            return { ...dt, data: sourceItems };
          }
          if (index === Number(destination.droppableId)) {
            return { ...dt, data: destItems };
          }
          return dt;
        });
      });
      handleChange(
        columns.map((dt, index) => {
          if (index === Number(source.droppableId)) {
            return { ...dt, data: sourceItems };
          }
          if (index === Number(destination.droppableId)) {
            return { ...dt, data: destItems };
          }
          return dt;
        })
      );
    }
    // else {
    //   const column = columns[Number(source.droppableId)];
    //   const copiedItems = [...column.data];
    //   const [removed] = copiedItems.splice(source.index, 1);
    //   copiedItems.splice(destination.index, 0, removed);
    //   setColumns((preValue: { status: string; data: IGetPriceQuote[] }[]) => {
    //     return preValue.map((dt, index) => {
    //       if (index === Number(source.droppableId)) {
    //         return { ...dt, data: copiedItems };
    //       }

    //       return dt;
    //     });
    //   });
    //   handleChange(
    //     columns.map((dt, index) => {
    //       if (index === Number(source.droppableId)) {
    //         return { ...dt, data: copiedItems };
    //       }

    //       return dt;
    //     })
    //   );
    // }
  };
  return (
    <DragDropContext
      onDragEnd={(result) => {
        onDragEnd(result, columns, setColumns);
        // console.log(result);
      }}
    >
      <div className="flex sm:justify-normal justify-center">
        <div className="flex w-full min-h-[60vh] flex-wrap gap-4 sm:justify-normal justify-center">
          {Object.entries(columns).map(([index, dt]) => {
            return (
              <Droppable key={index} droppableId={index}>
                {(provided) => {
                  return (
                    <div
                      className="bg-gray-100"
                      style={{
                        minHeight: "100px",
                        display: "flex",
                        maxHeight: "fit-content",
                        flexDirection: "column",
                        minWidth: "300px",
                        borderRadius: "15px",
                        padding: "15px 15px",
                        // marginRight: "12px",
                      }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="flex justify-between items-center">
                        <div
                          style={{
                            fontWeight: "bold",
                            color: "#1BA29B",
                            fontSize: 16,
                            marginBottom: "1.5px",
                          }}
                        >
                          {dt.status === "draff"
                            ? "Nháp"
                            : dt.status === "send"
                            ? "Đã gửi"
                            : dt.status === "open"
                            ? "Đã Xem"
                            : dt.status === "edit"
                            ? "Đang chỉnh sửa"
                            : dt.status === "refuse"
                            ? "Từ chối"
                            : "Chấp nhận"}
                        </div>
                        <div>
                          <VscSettings />
                        </div>
                      </div>

                      <div className="max-h-[70vh] overflow-auto min-h-8">
                        {dt.data
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                          )
                          .map((item, index) => {
                            console.log(new Date(item.updated_at).getTime());
                            return (
                              <TaskCard key={index} item={item} index={index} />
                            );
                          })}
                      </div>
                      <div>
                        {/* <Button
                          type="link"
                          className="text-[#EC8920]"
                          icon={<IoAddOutline />}
                        >
                          Thêm hoạt động
                        </Button> */}
                        {/* <ModalAddActivity
                          idStatus={column.status_activity_id}
                          idType={id as string}
                          type="schedule"
                        /> */}
                      </div>
                      {/* {provided.placeholder} */}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
