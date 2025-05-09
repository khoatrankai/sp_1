import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { AppDispatch, RootState } from "@/redux/store/store";
// import { useParams } from "next/navigation"; 
import { useDispatch } from "react-redux";
import { VscSettings } from "react-icons/vsc";
import usePostData from "@/hooks/usePostData";
import { IGetStatusWork } from "@/models/activityInterface";
import { fetchTypeWorksID } from "@/redux/store/slices/activitySlices/type_id_work.slice";
import activityService from "@/services/activityService";
import ModalAddWork from "@/components/Work/Tool/Modal/ModalWork";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

// type Props= {
//   // id:string,
//   // idCurrent?:string
// }

const Kanban = () => {
  const [columns, setColumns] = useState<IGetStatusWork[]>([]);
  const { postdata } = usePostData();
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      dispatch(fetchTypeWorksID(id.toString()));
    }
  }, [searchParams]);
  const { datas: dataType } = useSelector(
    (state: RootState) => state.get_type_id_works
  );
  useEffect(() => {
    setColumns(dataType?.status ?? []);
  }, [dataType]);
  // useEffect(() => {
  //   console.log(columns);
  // }, [columns]);
  const handleChange = async (datas: IGetStatusWork[]) => {
    const dataReq = datas
      .map((dt) =>
        dt.work.map((dtt, index) => {
          return {
            activity_id: dtt.work_id,
            status: dt.status_work_id,
            position: index + 1,
          };
        })
      )
      .flat();
    const statusCode = await postdata(() =>
      activityService.updateStatusListActivity(dataReq)
    );
    if (statusCode === 200) {
      dispatch(fetchTypeWorksID(searchParams.get('id') ?? ""));
    }
  };
  const onDragEnd = (
    result: DropResult,
    columns: IGetStatusWork[],
    setColumns: React.Dispatch<React.SetStateAction<IGetStatusWork[]>>
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[Number(source.droppableId)];
      const destColumn = columns[Number(destination.droppableId)];
      const sourceItems = [...sourceColumn.work];
      const destItems = [...destColumn.work];
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
      setColumns((preValue: IGetStatusWork[]) => {
        return preValue.map((dt, index) => {
          if (index === Number(source.droppableId)) {
            return { ...dt, activity: sourceItems };
          }
          if (index === Number(destination.droppableId)) {
            return { ...dt, activity: destItems };
          }
          return dt;
        });
      });
      handleChange(
        columns.map((dt, index) => {
          if (index === Number(source.droppableId)) {
            return { ...dt, activity: sourceItems };
          }
          if (index === Number(destination.droppableId)) {
            return { ...dt, activity: destItems };
          }
          return dt;
        })
      );
    } else {
      const column = columns[Number(source.droppableId)];
      const copiedItems = [...column.work];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      // setColumns({
      //   ...columns,
      //   [source.droppableId]: {
      //     ...column,
      //     activity: copiedItems,
      //   },
      // });
      setColumns((preValue: IGetStatusWork[]) => {
        return preValue.map((dt, index) => {
          if (index === Number(source.droppableId)) {
            return { ...dt, activity: copiedItems };
          }

          return dt;
        });
      });
      handleChange(
        columns.map((dt, index) => {
          if (index === Number(source.droppableId)) {
            return { ...dt, activity: copiedItems };
          }

          return dt;
        })
      );
    }
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
          {Object.entries(columns).map(([columnId, column]) => {
            return (
              <Droppable key={columnId} droppableId={columnId}>
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
                          {column.name}
                        </div>
                        <div>
                          <VscSettings />
                        </div>
                      </div>

                      <div className="max-h-[70vh] overflow-auto min-h-8">
                        {column.work.map((item, index) => (
                          <TaskCard key={index} item={item} index={index} />
                        ))}
                      </div>
                      <div>
                        {/* <Button
                          type="link"
                          className="text-[#EC8920]"
                          icon={<IoAddOutline />}
                        >
                          Thêm hoạt động
                        </Button> */}
                        <ModalAddWork
                          idStatus={column.status_work_id}
                          idType={searchParams.get('id') as string}
                          type="schedule"
                        />
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
