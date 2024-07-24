"use client";
import { getUniqueRecord } from "@/app/_services/service";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Card from "./Card";
import { GraduationCap, TrendingDown, TrendingUp } from "lucide-react";

export const StatusList = ({ attendanceList, selectedMonth }) => {
    const [totalStudent, setTotalStudent] = useState(0);
    const [presentPerc, setPresentPerc] = useState(0);

    useEffect(() => {
        if (attendanceList && attendanceList.length > 0) {
            const totalSt = getUniqueRecord(attendanceList);
            setTotalStudent(totalSt.length);
        

            const year = moment(selectedMonth).format("YYYY"); // Formatnya "YYYY" untuk mendapatkan tahun 4 digit
            const month = moment(selectedMonth).format("MM"); // Formatnya "MM" untuk mendapatkan bulan 2 digit

            function getWeekdaysInMonth(year, month) {
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
                console.log("Weekdays: ", weekdays);
                return weekdays;
            }

            let totalDays = getWeekdaysInMonth(year, month).length;
            const presentCount = attendanceList.filter((record) => record.present).length;
            const maxPossibleAttendances = totalSt.length * totalDays;
            console.log(maxPossibleAttendances);
            const presentPercentage = maxPossibleAttendances > 0 ? (presentCount / maxPossibleAttendances) * 100 : 0;

            setPresentPerc(presentPercentage);
        } else {
            setTotalStudent(0);
            setPresentPerc(0);
        }
    }, [attendanceList]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
            <Card icon={<GraduationCap />} title={"Total Santri"} value={totalStudent} />
            <Card icon={<TrendingUp />} title={"Total Kehadiran"} value={presentPerc.toFixed(1) + "%"} />
            <Card icon={<TrendingDown />} title={"Total Absent"} value={(100 - presentPerc).toFixed(1) + "%"} />
        </div>
    );
};
