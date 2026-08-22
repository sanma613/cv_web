// 1
const pupils: string[] = ["Alex", "John", "Sarah", "David", "Emma"];
pupils.forEach((p) => console.log(p));

// 2
console.log("Total pupils:", pupils.length);

// 3
const scores: number[] = [12, 45, 67, 89, 23, 91];
let totalScore = 0;
for (const s of scores) {
  totalScore += s;
}
console.log("Total score:", totalScore);

// 4
const randomVals: number[] = [];
let randomSum = 0;
for (let idx = 0; idx < 1500; idx++) {
  const val = Math.floor(Math.random() * 100) + 1;
  randomVals.push(val);
  randomSum += val;
}
console.log("1500 items sum:", randomSum);

// 5
const averageScore = totalScore / scores.length;
console.log("Average score:", averageScore);

// 6
console.log("Scores above 50:");
scores.forEach((s) => {
  if (s > 50) console.log(s);
});

// 7
const userProfile = {
  fullName: "Alex Rivera",
  yearsOld: 24,
  cityName: "Bogota"
};
console.log(`${userProfile.fullName} is ${userProfile.yearsOld} and lives in ${userProfile.cityName}`);

// 8
const itemCatalog = [
  { item: "Keyboard", cost: 45 },
  { item: "Screen", cost: 180 },
  { item: "Headset", cost: 75 },
  { item: "Webcam", cost: 60 }
];
itemCatalog.forEach((entry) => console.log(`${entry.item} costs $${entry.cost}`));

// 9
let priciestItem = itemCatalog[0]!;
itemCatalog.forEach((entry) => {
  if (entry.cost > priciestItem.cost) {
    priciestItem = entry;
  }
});
console.log(`Most expensive item: ${priciestItem.item} at $${priciestItem.cost}`);

// 10
const stockList = [
  { item: "Keyboard", cost: 45, qty: 12 },
  { item: "Screen", cost: 180, qty: 4 },
  { item: "Headset", cost: 75, qty: 15 },
  { item: "Webcam", cost: 60, qty: 9 }
];

let grandTotal = 0;
stockList.forEach((i) => {
  grandTotal += i.cost * i.qty;
});
console.log("Inventory grand total:", grandTotal);

// 11
const classRoster = [
  {
    name: "Alex",
    term: 3,
    courses: [
      { subject: "Logic", grade: 4.2 },
      { subject: "Database", grade: 3.8 }
    ]
  },
  {
    name: "John",
    term: 1,
    courses: [
      { subject: "Logic", grade: 2.9 },
      { subject: "Database", grade: 3.1 }
    ]
  },
  {
    name: "Sarah",
    term: 4,
    courses: [
      { subject: "Logic", grade: 4.9 },
      { subject: "Database", grade: 4.7 }
    ]
  }
];

let globalSum = 0;
const computedResults: { name: string; gpa: number }[] = [];

classRoster.forEach((student) => {
  let marksTotal = 0;
  student.courses.forEach((c) => {
    marksTotal += c.grade;
  });

  const studentGpa = marksTotal / student.courses.length;
  console.log(`${student.name} GPA: ${studentGpa.toFixed(2)}`);

  globalSum += studentGpa;
  computedResults.push({ name: student.name, gpa: studentGpa });
});

const overallGpa = globalSum / classRoster.length;
console.log("Overall class GPA:", overallGpa.toFixed(2));

// 12
console.log("Top performing students (> 3.5):");
computedResults.forEach((res) => {
  if (res.gpa > 3.5) {
    console.log(res.name);
  }
});