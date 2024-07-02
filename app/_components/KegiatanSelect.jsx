"use client";
import React, { useState, useEffect } from "react";
import GlobalApi from "../_services/GlobalApi";
import { toast } from "sonner";

export default function KegiatanSelect({ selectedKegiatan }) {
    const [kegiatan, setKegiatan] = useState([]);

    useEffect(() => {
        toast("Loading...");
        GetAllKegiatanList();
    }, []);

    const formatString = (str) => {
        return str.replace(/_/g, " ");
    };

    const GetAllKegiatanList = async () => {
        try {
            const resp = await GlobalApi.GetAllKegiatan();
            setKegiatan(resp.data);
        } catch (error) {
            console.error("Failed to fetch kegiatan", error);
        }
    };

    return (
        <div>
            <select className="p-2 w-[135px] border rounded-lg outline-none" onChange={(e) => selectedKegiatan(e.target.value)}>
                {kegiatan.map((item, index) => (
                    <option key={index} value={item.kegiatan}>
                        {formatString(item.kegiatan)}
                    </option>
                ))}
            </select>
        </div>
    );
}
