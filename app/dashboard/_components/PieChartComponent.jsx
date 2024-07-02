"use client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getUniqueRecord } from "@/app/_services/service";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

export const PieChartComponent = ({ attendanceList, selectedMonth }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (attendanceList && attendanceList.length > 0) {
            const totalSt = getUniqueRecord(attendanceList);
            const monthSelected = moment(selectedMonth).month() + 1;
            const currentMonth = moment().month() + 1;

            let totalDays;
            if (monthSelected !== currentMonth) {
                totalDays = moment(monthSelected).daysInMonth();
            } else {
                totalDays = moment().date(); // Jumlah hari hingga hari ini dalam bulan
            }
            const presentCount = attendanceList.filter((record) => record.present).length;
            const maxPossibleAttendances = totalSt.length * totalDays;
            const presentPerc = maxPossibleAttendances > 0 ? (presentCount / maxPossibleAttendances) * 100 : 0;
            setData([
                {
                    name: "Total Present",
                    value: Number(presentPerc.toFixed(1)),
                    fill: "#8884d8",
                },
                {
                    name: "Total Absent",
                    value: 100 - Number(presentPerc.toFixed(1)),
                    fill: "#82ca9d",
                },
            ]);
        }
    }, [attendanceList]);

    return (
        <div className="border p-5 rounded-lg">
            <h2 className="font-bold text-xl">Kehadiran Bulanan</h2>
            <ResponsiveContainer width={"100%"} height={300}>
                <PieChart width={730} height={250}>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
