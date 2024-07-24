"use client";
import React, { useEffect, useState } from "react";
import AddNewStudent from "./_componnents/AddNewStudent";
import GlobalApi from "@/app/_services/GlobalApi";
import { StudentListTable } from "./_componnents/StudentListTable";
import { toast } from "sonner";

export default function Student() {
    const [studentList, setStudentList] = useState([]);

    useEffect(() => {
        toast("Loading...");
        GetAllStudents();
    }, []);

    const GetAllStudents = () => {
        GlobalApi.GetAllStudents().then((resp) => {
            setStudentList(resp.data);
        });
    };
    console.log("Student list: ", studentList);
    return (
        <div className="p-7 ">
            <h2 className="font-bold text-3xl flex justify-between items-center">
                Santri
                <AddNewStudent refreshData={GetAllStudents} />
            </h2>
            <StudentListTable studentList={studentList} refreshData={GetAllStudents} />
        </div>
    );
}
