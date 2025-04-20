/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import "gantt-schedule-timeline-calendar/dist/style.css";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { IGetActivity } from "@/models/activityInterface";
import { IGetContract } from "@/models/contractInterface";
import ModalUpdateActivity from "../Tool/Modal/ModalUpdateActivity/ModalUpdateActivity";
import usePostData from "@/hooks/usePostData";
import activityService from "@/services/activityService";
import DelayCustom from "@/utils/DelayCustom";
import "./styles.scss";
let GSTC: any, gstc: any, state: any;

const initializeGSTC = async (
  element: any,
  dataActivity: IGetActivity[],
  dataContract: IGetContract[],
  setIdModal: any,
  handleDebounce: any
) => {
  GSTC = (await import("gantt-schedule-timeline-calendar")).default;
  const TimelinePointer = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js"
    )
  ).Plugin;
  const Selection = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js"
    )
  ).Plugin;
  const ItemResizing = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js"
    )
  ).Plugin;
  const ItemMovement = (
    await import(
      "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js"
    )
  ).Plugin;

  // helper functions

  function generateRows() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Rows }
     */
    const rows: any = {};
    dataContract.forEach((dt) => {
      const id = GSTC.api.GSTCID(dt.contract_id);
      rows[id] = {
        id,
        label: `${dt.name_contract}`,
      };
    });
    // for (let i = 0; i < 10; i++) {
    //   const id = GSTC.api.GSTCID(i.toString());
    //   rows[id] = {
    //     id,
    //     label: `Row ${i}`,
    //   };
    // }
    return rows;
  }

  function generateItems() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Items }
     */
    const items: any = {};
    // let start = GSTC.api.date().startOf("day").subtract(6, "day");
    dataActivity.forEach((dt) => {
      const id = GSTC.api.GSTCID(dt.activity_id.toString());
      const rowId = GSTC.api.GSTCID(dt.contract?.contract_id);
      // <div style="background:url(https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70._SX1080_FMjpg_.jpg),transparent;border-radius:100%;width:34px;height:34px;vertical-align: middle;background-size: 100%;margin: auto 10px;flex-shrink:0;"></div>
      items[id] = {
        id,
        label: `
            <div id="href-${id}" class=" w-full">
 <div class="flex items-center">
                
                <div class="flex flex-col flex-1">
                <p class="text-sm font-semibold">${dt.name}</p>
                <p class="text-xs text-gray-300">${dt.description ?? ""}</p>
                </div>
            </div>
            </div>
           
           
          `,
        rowId,
        height: 50,
        time: {
          start: new Date(dt.time_start).getTime(),
          end: new Date(dt.time_end).getTime(),
        },
        isHTML: true,
      };
    });
    // for (let i = 0; i < 10; i++) {

    // }
    return items;
  }

  /**
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */
  const config = {
    licenseKey:
      "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
    plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
    list: {
      columns: {
        data: {
          [GSTC.api.GSTCID("id")]: {
            id: GSTC.api.GSTCID("id"),
            width: 60,
            data: ({ row }: any) => GSTC.api.sourceID(row.id),
            header: {
              content: "ID",
            },
          },
          [GSTC.api.GSTCID("label")]: {
            id: GSTC.api.GSTCID("label"),
            width: 200,
            data: "label",
            header: {
              content: "Công trình",
            },
          },
        },
      },
      rows: generateRows(),
    },
    chart: {
      items: generateItems(),
    },
  };

  state = GSTC.api.stateFromConfig(config);

  state.subscribe(
    "config.chart.items",
    async (itemsNew: any, itemsOld: any) => {
      if (itemsOld.type === "update" && itemsOld.path.update !== "") {
        const idUpdate = itemsOld.path.update
          .replace("config.chart.items.gstcid-", "")
          .replace(".time", "");
        const dataNew = itemsNew[`gstcid-${idUpdate}`];
        handleDebounce(idUpdate, dataNew);
      }
    }
  );
  gstc = GSTC({
    element,
    state,
  });

  const itemss = generateItems();
  Object.keys(itemss).forEach((dt) => {
    const link = document.getElementById(`href-${dt}`);
    // console.log(dt);
    if (link) {
      // console.log(link);
      link.addEventListener("dblclick", function () {
        setIdModal(dt);
      });
    }
  });
};

export default function Home() {
  const { useDebounce } = DelayCustom();
  const { postdata } = usePostData();
  const handleUpdate = async (idUpdate: any, dt: any) => {
    await postdata(() =>
      activityService.updateActivity(idUpdate, {
        time_start: dt.time.start,
        time_end: dt.time.end,
      })
    );
  };
  const handleDebounce = useDebounce(handleUpdate, 1000);
  const [idModal, setIdModal] = useState("");
  const refBtn = useRef<HTMLButtonElement>();
  const { datas: dataActivity } = useSelector(
    (state: RootState) => state.get_activities
  );
  const { datas: dataContract } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const callback = useCallback((element: any) => {
    if (element)
      initializeGSTC(
        element,
        dataActivity,
        dataContract,
        setIdModal,
        handleDebounce
      );
  }, []);
  useEffect(() => {
    if (idModal !== "") {
      refBtn.current?.click();
    }
  }, [idModal]);
  useEffect(() => {
    return () => {
      if (gstc) {
        gstc.destroy();
      }
    };
  }, [dataActivity, dataContract]);

  return (
    <div className="!w-full h-full">
      <hr />
      <div id="gstc" className="!h-full" ref={callback}></div>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #gstc {
          height: 100%; /* Hoặc thiết lập chiều cao cụ thể, ví dụ: 500px */
          overflow-y: auto; /* Thêm cuộn dọc nếu nội dung vượt quá chiều cao */
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <ModalUpdateActivity
        ID={idModal.replace("gstcid-", "")}
        refBtn={refBtn as React.Ref<HTMLButtonElement>}
        type="gantt"
      />
    </div>
  );
}
