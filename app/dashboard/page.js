"use client";
import React, { useEffect, useState } from "react";
import KegiatanSelect from "../_components/KegiatanSelect";
import MonthSelect from "../_components/MonthSelect";
import GradeSelect from "../_components/GradeSelect";
import GlobalApi from "../_services/GlobalApi";
import moment from "moment";
import { StatusList } from "./_components/StatusList";
import BarChartComponent from "./_components/BarChartComponent";
import { PieChartComponent } from "./_components/PieChartComponent";
import { toast } from "sonner";

function Dashboard() {
    const [selectedKegiatan, setSelectedKegiatan] = useState("KBM_Pagi");
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedGrade, setSelectedGrade] = useState("Dasar");
    const [attendanceList, setAttendanceList] = useState();
    const [totalPresentData, setTotalPresentData] = useState([]);
    const kegiatan = selectedKegiatan;

    useEffect(() => {
        getStudentAttendance();
        toast("Loading...");
        getTotalPresentCountByday();
        console.log("kehadiran: ", attendanceList);
    }, [selectedMonth || selectedGrade || selectedKegiatan]);

    const getStudentAttendance = () => {
        GlobalApi.GetAttendanceList(selectedGrade, moment(selectedMonth).format("MM/yyyy"), kegiatan).then((resp) => {
            setAttendanceList(resp.data);
        });
    };

    const getTotalPresentCountByday = () => {
        GlobalApi.TotalPresentCountByDay(moment(selectedMonth).format("MM/yyyy"), selectedGrade, kegiatan).then((resp) => {
            setTotalPresentData(resp.data);
        });
    };

    return (
        <div className="p-10">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-3xl">Dashboard</h2>
                <div className="flex items-center gap-4">
                    <KegiatanSelect selectedKegiatan={(v) => setSelectedKegiatan(v)} />
                    <MonthSelect selectedMonth={setSelectedMonth} />
                    <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
                </div>
            </div>
            <StatusList attendanceList={attendanceList} selectedMonth={selectedMonth} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <BarChartComponent attendanceList={attendanceList} totalPresentData={totalPresentData} selectedMonth={selectedMonth} />
                </div>
                <div>
                    <PieChartComponent attendanceList={attendanceList} selectedMonth={selectedMonth} />
                </div>
            </div>
        </div>
    );
}


export default Dashboard;
