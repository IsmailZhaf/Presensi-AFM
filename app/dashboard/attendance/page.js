"use client";
import KegiatanSelect from "@/app/_components/KegiatanSelect";
import GradeSelect from "@/app/_components/GradeSelect";
import MonthSelect from "@/app/_components/MonthSelect";
import GlobalApi from "@/app/_services/GlobalApi";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AttendanceGrid from "./_components/AttendanceGrid";

export default function Attendance() {
    const [selectedKegiatan, setSelectedKegiatan] = useState("KBM_Pagi");
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedGrade, setSelectedGrade] = useState("Dasar");
    const [attendanceList, setAttendanceList] = useState();

    ///Untuk fetching  daftar kehadiran berdasarkan bulan dan kelas
    const onSearchHandler = () => {
        const kegiatan = selectedKegiatan;
        const month = moment(selectedMonth).format("MM/YYYY");
        GlobalApi.GetAttendanceList(selectedGrade, month, kegiatan).then((resp) => {
            console.log("hasil: ", resp.data);
            setAttendanceList(resp.data);
        });
    };
    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold">Kehadiran</h2>
            {/* Search option */}
            <div className="flex gap-5 my-5 p-5 border rounded-lg shadow-sm">
                <div className="flex gap-2 items-center">
                    <label>Pilih Kegiatan:</label>
                    <KegiatanSelect selectedKegiatan={(value) => setSelectedKegiatan(value)} />
                </div>
                <div className="flex gap-2 items-center">
                    <label>Pilih Bulan:</label>
                    <MonthSelect selectedMonth={(value) => setSelectedMonth(value)} />
                </div>
                <div className="flex gap-2 items-center">
                    <label>Pilih Kelas:</label>
                    <GradeSelect selectedGrade={(value) => setSelectedGrade(value)} />
                </div>
                <Button onClick={() => onSearchHandler()}>Search</Button>
            </div>

            {/* Student Attendance Grid */}
            <AttendanceGrid attendanceList={attendanceList} selectedMonth={selectedMonth} selectedKegiatan={selectedKegiatan} />
        </div>
    );
}
