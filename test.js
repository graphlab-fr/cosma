const currentDate = new Date();
const currentYear = currentDate.getFullYear().toString().padStart(4, "0");;
const currentMonth = currentDate.getMonth().toString().padStart(2, "0");
const currentDay = currentDate.getDate().toString().padStart(2, "0");
const currentHour = currentDate.getHours().toString().padStart(2, "0");
const currentMinute = currentDate.getMinutes().toString().padStart(2, "0");
const currentSecond = currentDate.getSeconds().toString().padStart(2, "0");

console.log(currentYear, currentMonth, currentDay, currentHour, currentMinute, currentSecond);