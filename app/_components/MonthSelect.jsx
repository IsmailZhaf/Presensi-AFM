"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { addMonths } from "date-fns";
import moment from "moment/moment";
import { Calendar } from "@/components/ui/calendar";

export default function MonthSelect({ selectedMonth }) {
    const nextMonths = addMonths(new Date(), 0);

    const [month, setMonth] = useState(nextMonths);

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2 items-center text-black">
                        <CalendarDays className="h-5 w-5" />
                        {moment(month).format("MMMM yyyy")}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar
                        mode="single"
                        month={month}
                        onMonthChange={(value) => {
                            selectedMonth(value);
                            setMonth(value);
                        }}
                        className="flex flex-1 justify-center"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
