'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';

export default function AddNewStudent({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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
      console.error('Failed to fetch grades', error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const resp = await GlobalApi.CreateNewStudent(data);
      console.log('---', resp);
      if (resp.data) {
        reset();
        refreshData();
        setLoading(false);
        setOpen(false); // Close the dialog on successful submission
        toast('Santri Baru Berhasil ditambahkan!');
      }
      setLoading(false);
    } catch (error) {
      console.error('Gagal menambahkan Santri', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>+ Tambah Santri Baru</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Tambah Santri Baru</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="py-2">
                  <label>Nama Lengkap</label>
                  <Input
                    placeholder="Ex. Ismail"
                    {...register('nama', { required: true })}
                  />
                  {errors.nama && (
                    <p className="text-red-500">Nama Lengkap is required</p>
                  )}
                </div>
                <div className="flex flex-col py-2">
                  <label>Pilih Kelas</label>
                  <select
                    className="p-3 border rounded-lg bg-white dark:bg-white"
                    {...register('kelas', { required: true })}
                  >
                    {grades.map((item, index) => (
                      <option key={index} value={item.kelas}>
                        {item.kelas}
                      </option>
                    ))}
                  </select>
                  {errors.kelas && (
                    <p className="text-red-500">Pilih Kelas is required</p>
                  )}
                </div>
                <div className="py-2">
                  <label>Angkatan</label>
                  <Input
                    placeholder="Ex. 2021"
                    {...register('angkatan', { required: true })}
                  />
                  {errors.angkatan && (
                    <p className="text-red-500">Angkatan is required</p>
                  )}
                </div>
                <div className="py-2">
                  <label>NIS</label>
                  <Input
                    type="number"
                    placeholder="Ex. 998876423"
                    {...register('NIS', { required: true })}
                  />
                  {errors.NIS && (
                    <p className="text-red-500">NIS is required</p>
                  )}
                </div>

                <div className="flex gap-3 items-center justify-end mt-5">
                  <Button
                    type="button"
                    onClick={() => setOpen(false)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <LoaderIcon className="animate-spin" /> : 'Save'}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
