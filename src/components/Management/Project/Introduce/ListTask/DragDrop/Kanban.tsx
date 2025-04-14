/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {Ref, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import {  useSearchParams } from "next/navigation";
import { VscSettings } from "react-icons/vsc";
import usePostData from "@/hooks/usePostData";
import { IGetTask, IGetWork2, IUpdateTask } from "@/models/activityInterface";
import activityService from "@/services/activityService";
import { Button } from "antd";
import { IoAddOutline } from "react-icons/io5";
import ModalAddTask from "@/components/Task/Tool/Modal/ModalTask";

const Kanban = () => {
  const [columns, setColumns] = useState<IGetTask[]>([]);
  const refBtn = useRef<HTMLButtonElement>()
  const { postdata } = usePostData();
  const searchParams = useSearchParams(); 
  const fetchData = async()=>{
    const res = await activityService.getWorkById(searchParams.get('id')??"")
    if(res.statusCode === 200){
      const datasNew = res.data as IGetWork2
      setColumns(datasNew?.tasks ?? [])
    }
  }

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      fetchData()
    }
  }, [searchParams]);
 
  const handleChange = async (datas: IUpdateTask[]) => {
    await postdata(()=>activityService.updateTasks(datas))
    // console.log(datas)
    // const dataReq = datas
    //   .map((dt) =>
    //     dt.work.map((dtt, index) => {
    //       return {
    //         activity_id: dtt.work_id,
    //         status: dt.status_work_id,
    //         position: index + 1,
    //       };
    //     })
    //   )
    //   .flat();
    // const statusCode = await postdata(() =>
    //   activityService.updateStatusListActivity(dataReq)
    // );
    // if (statusCode === 200) {
    //   dispatch(fetchTypeWorksID(id.toString()));
    // }
  };
  const onDragEnd = (
    result: DropResult,
    columns: IGetTask[],
    setColumns: React.Dispatch<React.SetStateAction<IGetTask[]>>
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if(source.droppableId !== destination.droppableId){
      setColumns((preValue:any)=>{
        const dataNew = preValue.map((dt:IGetTask)=>{
          // console.log(dt)
          if(result.draggableId === dt.task_id){
            return {...dt,status:destination.droppableId,position:destination.index}
          }else{
            if(dt.status === destination.droppableId){
              if(dt.position >= destination.index){
                return {...dt,position:dt.position + 1}
              }
            }
            if(dt.status === source.droppableId){
              if(dt.position > source.index){
                return {...dt,position:dt.position - 1}
              }
            }
          }
          
          
        
          return dt
        })
        handleChange(dataNew as IUpdateTask[])
        return dataNew
      })
    }else{
      setColumns((preValue:any)=>{
        const dataNew = preValue.map((dt:IGetTask)=>{
          // console.log(dt)
          if(result.draggableId === dt.task_id){
            return {...dt,status:destination.droppableId,position:destination.index}
          }else{
            if(dt.status === source.droppableId){
              
              if(source.index < destination.index){
                if(dt.position > source.index && dt.position <=destination.index)
                return {...dt,position:dt.position - 1}
              }
              if(source.index > destination.index){
                if(dt.position < source.index && dt.position >=destination.index)
                  return {...dt,position:dt.position + 1}
              }
            }
          }
          
          
        
          return dt
        })
        handleChange(dataNew as IUpdateTask[])
        return dataNew
      })
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
        <Droppable key={'fail'} droppableId={'fail'} >
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
                        flex:'1 1 0%'
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
                          Thất bại
                        </div>
                        <div>
                          <VscSettings />
                        </div>
                      </div>

                      <div className="max-h-[70vh] overflow-auto min-h-8">
                        {columns.filter((dt)=> dt.status === "fail").sort((a,b)=> a.position - b.position).map((item, index) => (
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
                        {/* <ModalAddTask 
                        /> */}
                      </div>
                      {/* {provided.placeholder} */}
                    </div>
                  );
                }}
              </Droppable>
              <Droppable key={'success'} droppableId={'success'}>
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
                        
                        flex:'1 1 0%'
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
                          Thành công
                        </div>
                        <div>
                          <VscSettings />
                        </div>
                      </div>

                      <div className="max-h-[70vh] overflow-auto min-h-8">
                        {columns.filter((dt)=> dt.status === "success").sort((a,b)=> a.position - b.position).map((item, index) => (
                          <TaskCard key={index} item={item} index={index} />
                        ))}
                      </div>
                      <div>
                       
                      </div>
                      {/* {provided.placeholder} */}
                    </div>
                  );
                }}
              </Droppable>
              <Droppable key={'waitting'} droppableId={'waitting'}>
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
                        
                        flex:'1 1 0%'
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
                          Đang thực hiện
                        </div>
                        <div>
                          <VscSettings />
                        </div>
                      </div>

                      <div className="max-h-[70vh] overflow-auto min-h-8">
                        {columns.filter((dt)=> dt.status === "waitting").sort((a,b)=> a.position - b.position).map((item, index) => (
                          <TaskCard key={index} item={item} index={index} />
                        ))}
                      </div>
                      <div>
                      <Button
                          type="link"
                          className="text-[#EC8920]"
                          icon={<IoAddOutline />}
                          onClick={()=>{refBtn.current?.click()}}
                        >
                          Thêm task
                        </Button> 
                         <ModalAddTask id={searchParams.get('id')?? ""} refBtnTask={refBtn as Ref<HTMLButtonElement>}/>
                      </div>
                      {/* {provided.placeholder} */}
                    </div>
                  );
                }}
              </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
