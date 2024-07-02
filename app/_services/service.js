// used to get Distinct user list
export const getUniqueRecord = (attendanceList) => {
    const uniqueRecord = [];
    const existingUser = new Set();

    attendanceList?.forEach((record) => {
        if (!existingUser.has(record.NIS)) {
            existingUser.add(record.NIS);
            uniqueRecord.push(record);
        }
    });

    return uniqueRecord;
};
