import { NotifyItem } from "@/models/userInterface";
import { fetchCountNotify } from "@/redux/store/slices/userSlices/get_count_notify.slice";
import { AppDispatch } from "@/redux/store/store";
import userService from "@/services/userService";
import { Button, Divider, List, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";

export default function Notify() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(2);
  const [data, setData] = useState<NotifyItem[]>([]);
  const [hasFetched, setHasFetched] = useState(false); // Cờ để kiểm soát gọi API

  const fetchData = async () => {
    const res = await userService.getNotifyUser(page + 1, 10);
    if (res.statusCode === 200) {
      setData((preValue) => [...preValue, ...res.data.data]);
      setTotalPage(res.data.total_page);
      setPage(res.data.page);
    }
  };

  const loadMoreData = () => {
    if (page === totalPage) {
      return;
    }
    setLoading(true);
    fetchData();
    setLoading(false);
  };
  const handleStatusNotify = async (notify_user_id?: string) => {
    const res = await userService.updateNotifyUser(notify_user_id);
    if (res.statusCode === 200) {
      if (notify_user_id) {
        setData((preValue) => {
          return preValue.map((dt) => {
            if (dt.notify_user_id === notify_user_id)
              return { ...dt, status: true };
            return dt;
          });
        });
      } else {
        setData((preValue) => {
          return preValue.map((dt) => {
            return { ...dt, status: true };
          });
        });
      }

      dispatch(fetchCountNotify());
    }
  };
  useEffect(() => {
    if (!hasFetched) {
      // Chỉ gọi API khi chưa fetch
      fetchData().then(() => setHasFetched(true));
      dispatch(fetchCountNotify());
    }
  }, [hasFetched]);

  return (
    <div className="flex flex-col w-full rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="w-full flex justify-end">
        <Button
          type="link"
          onClick={() => {
            handleStatusNotify();
          }}
        >
          Đánh dấu đã đọc tất cả
        </Button>
      </div>
      <div
        className="border-t-[1px]"
        id="scrollableDiv"
        style={{
          height: 250,
          overflow: "auto",
          padding: "0 16px",
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 50}
          loader={<>{loading && <Skeleton paragraph={{ rows: 1 }} active />}</>}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                key={item.notify.notify_id}
                onClick={() => {
                  handleStatusNotify(item.notify_user_id);
                }}
              >
                <List.Item.Meta
                  title={
                    <a href={item.notify.link}>{item.notify.description}</a>
                  }
                  description={new Date(
                    item.notify.created_at
                  ).toLocaleDateString("vi-VN")}
                />
                <div
                  hidden={item.status}
                  className="rounded-full w-4 h-4 bg-blue-500"
                ></div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
}
