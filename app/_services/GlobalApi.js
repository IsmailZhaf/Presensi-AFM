const { default: axios } = require("axios");

const Login = (data) => axios.post("/api/login", data);
const Register = (data) => axios.post("/api/register", data);
const GetAllGrades = () => axios.get("/api/grades");
const GetAllKegiatan = () => axios.get("/api/kegiatan");
const CreateNewStudent = (data) => axios.post("/api/students", data);
const UpdateStudent = (data) => axios.put("/api/students", data);
const UpdatePoin = (kegiatan, NIS, totalPoints) => axios.get("/api/poin?kegiatan=" + kegiatan + "&NIS=" + NIS + "&totalPoints=" + totalPoints);
const GetAllStudents = () => axios.get("/api/students");
const DeleteStudentRecord = (NIS) => axios.delete("/api/students?NIS=" + NIS);
const GetAttendanceList = (grade, month, kegiatan) => axios.get("/api/attendance?grade=" + grade + "&month=" + month + "&kegiatan=" + kegiatan);
const MarkAttendance = (data, kegiatan, NIS, selectedMonth) => axios.post("/api/attendance?kegiatan=" + kegiatan + "&NIS=" + NIS + "$selectedMonth=" + selectedMonth, data);
const MarkAbsent = (NIS, day, date, kegiatan) => axios.delete("/api/attendance?NIS=" + NIS + "&day=" + day + "&date=" + date + "&kegiatan=" + kegiatan);
const TotalPresentCountByDay = (date, grade, kegiatan) => axios.get("/api/dashboard?date=" + date + "&grade=" + grade + "&kegiatan=" + kegiatan);

export default {
    Login,
    Register,
    GetAllGrades,
    GetAllKegiatan,
    CreateNewStudent,
    UpdateStudent,
    UpdatePoin,
    GetAllStudents,
    DeleteStudentRecord,
    GetAttendanceList,
    MarkAttendance,
    MarkAbsent,
    TotalPresentCountByDay,
};
