import { getUniqueRecord } from '@/app/_services/service';
import moment from 'moment';
import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from 'recharts';

export default function BarChartComponent({
  attendanceList,
  totalPresentData,
  selectedMonth,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attendanceList !== undefined && totalPresentData !== undefined) {
      formatAttendanceListCount();
    }
  }, [attendanceList, totalPresentData]);

  const formatAttendanceListCount = () => {
    const totalStudent = getUniqueRecord(attendanceList);
    const daysInMonth = generateDaysArray(selectedMonth);

    // Buat array hasil dengan semua hari dalam bulan
    const result = daysInMonth.map((day) => {
      const presentData = totalPresentData.find((item) => item.day == day) || {
        presentCount: 0,
      };
      return {
        day: day,
        presentCount: presentData.presentCount,
        absentCount: totalStudent.length - presentData.presentCount,
      };
    });

    setData(result);
    setLoading(false); // Set loading to false once data is ready
  };

  // Fungsi untuk membuat array berisi semua hari dalam bulan
  const generateDaysArray = (selectedMonth) => {
    const year = moment(selectedMonth).format('YYYY');
    const month = moment(selectedMonth).format('MM');
    const weekdays = [];
    const startDate = moment(`${month}/${year}`, 'MM/YYYY').startOf('month');
    const endDate = moment(`${month}/${year}`, 'MM/YYYY').endOf('month');

    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.day(); // 0: Sunday, 1: Monday, ..., 6: Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Exclude Sunday (0) and Saturday (6)
        weekdays.push(currentDate.format('DD'));
      }
      currentDate.add(1, 'day');
    }
    return weekdays;
  };

  const memoizedData = useMemo(() => data, [data]);
  return (
    <div className="p-5 border rounded-lg shadow-sm">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="my-2 font-bold text-lg">Kehadiran</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={memoizedData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis
                label={{ value: 'Jumlah Santri', angle: -90, position: 'left' }}
              />
              <Tooltip />
              <Legend verticalAlign="bottom" />
              <Bar
                dataKey="presentCount"
                name="Total Kehadiran"
                fill="#8884d8"
              />
              <Bar dataKey="absentCount" name="Total Absent" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <h1 className="text-black text-center">Tanggal KBM</h1>
        </div>
      )}
    </div>
  );
}
