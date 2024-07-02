import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import moment from "moment";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";
import { getUniqueRecord } from "@/app/_services/service";

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100];

export default function AttendanceGrid({ attendanceList, selectedMonth, selectedKegiatan }) {
    const [NIS, setNIS] = useState();
    const [totalPoint, setTotalPoint] = useState(0);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([
        { field: "NIS", filter: true },
        { field: "nama", filter: true },
    ]);
    const kegiatan = selectedKegiatan;
    console.log("kehadiran: ", attendanceList);

    const getWeekdaysInMonth = (year, month) => {
        const weekdays = [];
        const startDate = moment(`${month}/${year}`, "MM/YYYY").startOf("month");
        const endDate = moment(`${month}/${year}`, "MM/YYYY").endOf("month");

        let currentDate = startDate;

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.day(); // 0: Sunday, 1: Monday, ..., 6: Saturday
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Exclude Sunday (0) and Saturday (6)
                weekdays.push(currentDate.format("DD"));
            }
            currentDate.add(1, "day");
        }
        return weekdays;
    };

    useEffect(() => {
        // Menggunakan `moment` untuk mendapatkan tahun dan bulan dari `selectedMonth`
        const year = moment(selectedMonth).format("YYYY"); // Formatnya "YYYY" untuk mendapatkan tahun 4 digit
        const month = moment(selectedMonth).format("MM"); // Formatnya "MM" untuk mendapatkan bulan 2 digit
        // Mendapatkan jumlah hari dalam bulan tertentu
        const daysArrays = getWeekdaysInMonth(year, month);

        // Mengatur kolom baru berdasarkan bulan yang dipilih
        const newColDefs = [
            { field: "NIS", filter: true },
            { field: "nama", filter: true },
        ];

        daysArrays.forEach((date) => {
            newColDefs.push({
                field: date.toString(),
                width: 50,
                editable: true,
            });
        });

        setColDefs(newColDefs);

        if (attendanceList) {
            const userList = getUniqueRecord(attendanceList);
            setRowData(userList);

            userList.forEach((obj) => {
                daysArrays.forEach((date) => {
                    obj[date] = isPresent(obj.NIS, date);
                });
            });
        }
    }, [attendanceList, selectedMonth]); // Menambahkan selectedMonth sebagai dependensi

    //used to check if user present or not
    const isPresent = (NIS, day) => {
        const result = attendanceList.find((item) => item.day == day && item.NIS == NIS);
        return result ? true : false;
    };

    const onMarkAttendance = (day, NIS, presentStatus) => {
        const date = moment(selectedMonth).format("MM/YYYY");

        if (presentStatus) {
            const data = {
                day: day,
                NIS: NIS,
                present: presentStatus,
                date: date,
            };
            GlobalApi.MarkAttendance(data, kegiatan, NIS, selectedMonth).then((resp) => {
                toast("NIS: " + NIS + " Marked as present");
                GlobalApi.UpdatePoin(kegiatan, NIS, resp.data).then((resp) => {});
            });
        } else {
            GlobalApi.MarkAbsent(NIS, day, date, kegiatan, NIS).then((resp) => {
                toast("NIS: " + NIS + " Marked as Absent");
            });
        }
    };

    return (
        <div
            className="ag-theme-quartz" // applying the grid theme
            style={{ height: 500 }} // the grid will fill the size of the parent container
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                onCellValueChanged={(e) => {
                    onMarkAttendance(e.colDef.field, e.data.NIS, e.newValue);
                    setNIS(e.data.NIS);
                }}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
            />
        </div>
    );
}
