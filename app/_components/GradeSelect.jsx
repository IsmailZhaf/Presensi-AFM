"use client";
import React, { useState, useEffect } from "react";
import GlobalApi from "../_services/GlobalApi";
import { useForm } from "react-hook-form";

export default function GradeSelect({ selectedGrade }) {
    const [grades, setGrades] = useState([]);
    const {
        formState: { errors },
    } = useForm();

    useEffect(() => {
        GetAllGradesList();
    }, []);

    const GetAllGradesList = async () => {
        try {
            const resp = await GlobalApi.GetAllGrades();
            setGrades(resp.data);
        } catch (error) {
            console.error("Failed to fetch grades", error);
        }
    };
    return (
        <div>
            <select className="p-2 w-[115px] border rounded-lg outline-none bg-white" onChange={(e) => selectedGrade(e.target.value)}>
                {grades.map((item, index) => (
                    <option key={index} value={item.kelas}>
                        {item.kelas}
                    </option>
                ))}
            </select>
        </div>
    );
}
