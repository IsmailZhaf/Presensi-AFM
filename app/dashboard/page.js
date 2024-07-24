'use client';
import React, { useEffect, useState } from 'react';
import KegiatanSelect from '../_components/KegiatanSelect';
import MonthSelect from '../_components/MonthSelect';
import GradeSelect from '../_components/GradeSelect';
import GlobalApi from '../_services/GlobalApi';
import moment from 'moment';
import { StatusList } from './_components/StatusList';
import BarChartComponent from './_components/BarChartComponent';
import { PieChartComponent } from './_components/PieChartComponent';
import { toast } from 'sonner';

function Dashboard() {
  const [selectedKegiatan, setSelectedKegiatan] = useState('KBM_Pagi');
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedGrade, setSelectedGrade] = useState('Dasar');
  const [attendanceList, setAttendanceList] = useState();
  const [totalPresentData, setTotalPresentData] = useState([]);
  const kegiatan = selectedKegiatan;

  useEffect(() => {
    getStudentAttendance();
    toast('Loading...');
    getTotalPresentCountByday();
    console.log('kehadiran: ', attendanceList);
  }, [selectedMonth || selectedGrade || selectedKegiatan]);

  const getStudentAttendance = () => {
    GlobalApi.GetAttendanceList(
      selectedGrade,
      moment(selectedMonth).format('MM/yyyy'),
      kegiatan
    ).then((resp) => {
      setAttendanceList(resp.data);
    });
  };

  const getTotalPresentCountByday = () => {
    GlobalApi.TotalPresentCountByDay(
      moment(selectedMonth).format('MM/yyyy'),
      selectedGrade,
      kegiatan
    ).then((resp) => {
      setTotalPresentData(resp.data);
    });
  };

  

  return (
    <div className="p-8">
      <div className="md:flex items-center justify-between">
        <h2 className="font-bold text-3xl">Dashboard</h2>
        <div className="md:flex space-y-3 items-center gap-4">
          <div className="flex gap-2 items-center">
            <label>Pilih Kegiatan:</label>
            <KegiatanSelect selectedKegiatan={(v) => setSelectedKegiatan(v)} />
          </div>
          <div className="flex gap-2 items-center">
            <label>Pilih Bulan:</label>
            <MonthSelect selectedMonth={(value) => setSelectedMonth(value)} />
          </div>
          <div className="flex gap-2 items-center">
            <label>Pilih Kelas:</label>
            <GradeSelect selectedGrade={(value) => setSelectedGrade(value)} />
          </div>
        </div>
      </div>
      <StatusList
        attendanceList={attendanceList}
        selectedMonth={selectedMonth}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <BarChartComponent
            attendanceList={attendanceList}
            totalPresentData={totalPresentData}
            selectedMonth={selectedMonth}
          />
        </div>
        <div>
          <PieChartComponent
            attendanceList={attendanceList}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
