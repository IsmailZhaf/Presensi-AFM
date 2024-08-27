import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Search, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import GlobalApi from "@/app/_services/GlobalApi";
import { toast } from "sonner";

export const StudentListTable = ({ studentList, refreshData }) => {
    const [open, setOpen] = useState();
    const [grades, setGrades] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [25, 50, 100];

    useEffect(() => {
        GetAllGradesList();
    }, []);

    useEffect(() => {
        if (studentList) {
            setRowData(studentList);
        }
    }, [studentList]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const GetAllGradesList = async () => {
        try {
            const resp = await GlobalApi.GetAllGrades();
            setGrades(resp.data);
        } catch (error) {
            console.error("Failed to fetch grades", error);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const resp = await GlobalApi.UpdateStudent(data);
            console.log("---", resp);
            if (resp.data) {
                reset();
                refreshData();
                setLoading(false);
                setOpen(false); // Close the dialog on successful submission
                toast("Student Updated!");
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to update student", error);
        }
    };

    const customButtons = (props) => {
        const handleEdit = () => {
            const student = props.data;
            setSelectedStudent(student);
            setValue("nama", student.nama);
            setValue("kelas", student.kelas);
            setValue("asal", student.asal);
            setValue("NIS", student.NIS);
            setOpen(true);
        };

        return (
            <div>
                {/* <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleEdit}>
                            <Edit />
                        </Button>
                    </DialogTrigger>
                    <DialogContent component={"span"}>
                        <DialogHeader>
                            <DialogTitle>Update Data Santri</DialogTitle>
                            <DialogDescription>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="py-2">
                                        <label>Nama Lengkap</label>
                                        <Input placeholder="Ex. Ismail" {...register("nama", { required: true })} />
                                        {errors.nama && <p className="text-red-500">Nama Lengkap is required</p>}
                                    </div>
                                    <div className="flex flex-col py-2">
                                        <label>Pilih Kelas</label>
                                        <select className="p-3 border rounded-lg" {...register("kelas", { required: true })}>
                                            {grades.map((item, index) => (
                                                <option key={index} value={item.kelas}>
                                                    {item.kelas}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kelas && <p className="text-red-500">Pilih Kelas is required</p>}
                                    </div>
                                    <div className="py-2">
                                        <label>Asal Daerah</label>
                                        <Input placeholder="Ex. Tangerang Timur" {...register("asal", { required: true })} />
                                        {errors.asal && <p className="text-red-500">Asal Daerah is required</p>}
                                    </div>
                                    <div className="py-2">
                                        <label>NIS</label>
                                        <Input type="number" placeholder="Ex. 998876423" {...register("NIS", { required: true })} />
                                        {errors.NIS && <p className="text-red-500">NIS is required</p>}
                                    </div>
                                    <div className="flex gap-3 items-center justify-end mt-5">
                                        <Button type="button" onClick={() => setOpen(false)} variant="ghost">
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? <LoaderIcon className="animate-spin" /> : "Save"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog> */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete your record and remove your data from our servers.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    deleteRecord(props?.data?.NIS);
                                }}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    };

    const [colDefs, setColDefs] = useState([
        { field: "NIS", filter: true },
        { field: "nama", filter: true },
        { field: "kelas", filter: true },
        { field: "angkatan", filter: true },
        { field: "action", cellRenderer: customButtons },
    ]);

    const [rowData, setRowData] = useState();
    const [searchInput, setSearchInput] = useState();
    const deleteRecord = (NIS) => {
        GlobalApi.DeleteStudentRecord(NIS).then((resp) => {
            if (resp) {
                toast("Record deleted successfully!");
                refreshData();
            }
        });
    };
    return (
        <div className="my-7">
            <div
                className="ag-theme-quartz w-[320px] md:w-full" // applying the grid theme
                style={{ height: 500 }} // the grid will fill the size of the parent container
            >
                <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
                    <Search />
                    <input type="text" placeholder="Search for anything..." className="w-full outline-none bg-white" onChange={(event) => setSearchInput(event.target.value)} />
                </div>
                <AgGridReact rowData={rowData} columnDefs={colDefs} quickFilterText={searchInput} pagination={pagination} paginationPageSize={paginationPageSize} paginationPageSizeSelector={paginationPageSizeSelector} />
            </div>
        </div>
    );
};
