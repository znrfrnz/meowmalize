import { Exercise } from '@/types'

export const exercises: Exercise[] = [
  {
    id: 'employee-project',
    title: 'Employee & Project',
    description: 'Normalize a table tracking employees, their departments, and the projects they work on.',
    unfTable: {
      columns: ['EmpID', 'EmpName', 'Dept', 'DeptHead', 'ProjID', 'ProjName', 'Hours'],
      rows: [
        { EmpID: 'E01', EmpName: 'Alice', Dept: 'Engineering', DeptHead: 'Bob', ProjID: 'P01', ProjName: 'Website', Hours: '20' },
        { EmpID: 'E01', EmpName: 'Alice', Dept: 'Engineering', DeptHead: 'Bob', ProjID: 'P02', ProjName: 'Mobile App', Hours: '15' },
        { EmpID: 'E02', EmpName: 'Carol', Dept: 'Marketing', DeptHead: 'Dave', ProjID: 'P01', ProjName: 'Website', Hours: '10' },
      ],
    },
    steps: [
      {
        step: 'UNF',
        ruleCardTitle: 'Unnormalized Form (UNF)',
        ruleCardBody:
          'The source table before any normalization. It may contain repeating groups, multi-valued attributes, or redundant data. Your goal is to understand its structure before applying normal forms.',
        hints: [],
        correctAnswer: [],
        unfViolatingColumns: [],
      },
      {
        step: '1NF',
        ruleCardTitle: 'First Normal Form (1NF)',
        ruleCardBody:
          'Every column must hold atomic (indivisible) values, and each row must be uniquely identifiable by a primary key. Eliminate repeating groups by ensuring one value per cell.',
        hints: [
          'First Normal Form requires a primary key that uniquely identifies each row.',
          'Look for rows that repeat the same employee data with different project values — the combination of two columns forms the key.',
          'The composite primary key is (EmpID, ProjID). Declare FDs: EmpID → EmpName, Dept, DeptHead; ProjID → ProjName; EmpID, ProjID → Hours.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'EmpID', isPK: true },
              { name: 'EmpName', isPK: false },
              { name: 'Dept', isPK: false },
              { name: 'DeptHead', isPK: false },
              { name: 'ProjID', isPK: true },
              { name: 'ProjName', isPK: false },
              { name: 'Hours', isPK: false },
            ],
            fds: [
              { lhs: ['EmpID'], rhs: ['EmpName', 'Dept', 'DeptHead'] },
              { lhs: ['ProjID'], rhs: ['ProjName'] },
              { lhs: ['EmpID', 'ProjID'], rhs: ['Hours'] },
            ],
          },
        ],
        unfViolatingColumns: ['EmpID', 'ProjID'],
      },
      {
        step: '2NF',
        ruleCardTitle: 'Second Normal Form (2NF)',
        ruleCardBody:
          'Every non-key attribute must be fully functionally dependent on the entire primary key — not just part of it. Remove partial dependencies by splitting the table.',
        hints: [
          'Second Normal Form removes partial dependencies: non-key columns that depend on only part of a composite key.',
          'EmpName, Dept, and DeptHead depend only on EmpID (not ProjID). ProjName depends only on ProjID.',
          'Decompose into three tables: Employee(EmpID, EmpName, Dept, DeptHead), Project(ProjID, ProjName), Assignment(EmpID, ProjID, Hours).',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'EmpID', isPK: true },
              { name: 'EmpName', isPK: false },
              { name: 'Dept', isPK: false },
              { name: 'DeptHead', isPK: false },
            ],
            fds: [{ lhs: ['EmpID'], rhs: ['EmpName', 'Dept', 'DeptHead'] }],
          },
          {
            columns: [
              { name: 'ProjID', isPK: true },
              { name: 'ProjName', isPK: false },
            ],
            fds: [{ lhs: ['ProjID'], rhs: ['ProjName'] }],
          },
          {
            columns: [
              { name: 'EmpID', isPK: true },
              { name: 'ProjID', isPK: true },
              { name: 'Hours', isPK: false },
            ],
            fds: [{ lhs: ['EmpID', 'ProjID'], rhs: ['Hours'] }],
          },
        ],
        unfViolatingColumns: ['EmpName', 'Dept', 'DeptHead', 'ProjName'],
      },
      {
        step: '3NF',
        ruleCardTitle: 'Third Normal Form (3NF)',
        ruleCardBody:
          'Every non-key attribute must depend directly on the primary key, not on another non-key attribute. Remove transitive dependencies.',
        hints: [
          'Third Normal Form removes transitive dependencies: when a non-key column determines another non-key column.',
          'In the Employee table, Dept → DeptHead. DeptHead is transitively dependent on EmpID through Dept.',
          'Extract a Department table: Dept(Dept, DeptHead). Update Employee to Employee(EmpID, EmpName, Dept). Project and Assignment tables remain unchanged.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'EmpID', isPK: true },
              { name: 'EmpName', isPK: false },
              { name: 'Dept', isPK: false },
            ],
            fds: [{ lhs: ['EmpID'], rhs: ['EmpName', 'Dept'] }],
          },
          {
            columns: [
              { name: 'Dept', isPK: true },
              { name: 'DeptHead', isPK: false },
            ],
            fds: [{ lhs: ['Dept'], rhs: ['DeptHead'] }],
          },
          {
            columns: [
              { name: 'ProjID', isPK: true },
              { name: 'ProjName', isPK: false },
            ],
            fds: [{ lhs: ['ProjID'], rhs: ['ProjName'] }],
          },
          {
            columns: [
              { name: 'EmpID', isPK: true },
              { name: 'ProjID', isPK: true },
              { name: 'Hours', isPK: false },
            ],
            fds: [{ lhs: ['EmpID', 'ProjID'], rhs: ['Hours'] }],
          },
        ],
        unfViolatingColumns: ['DeptHead'],
      },
    ],
  },
  {
    id: 'student-course',
    title: 'Student & Course',
    description: 'Normalize a table recording students, their courses, instructors, and grades.',
    unfTable: {
      columns: ['StudentID', 'StudentName', 'CourseID', 'CourseName', 'InstructorID', 'InstructorName', 'Grade'],
      rows: [
        { StudentID: 'S01', StudentName: 'Emma', CourseID: 'CS101', CourseName: 'Intro to CS', InstructorID: 'I01', InstructorName: 'Prof. Smith', Grade: 'A' },
        { StudentID: 'S01', StudentName: 'Emma', CourseID: 'CS202', CourseName: 'Data Structures', InstructorID: 'I02', InstructorName: 'Prof. Jones', Grade: 'B' },
        { StudentID: 'S02', StudentName: 'Liam', CourseID: 'CS101', CourseName: 'Intro to CS', InstructorID: 'I01', InstructorName: 'Prof. Smith', Grade: 'B+' },
      ],
    },
    steps: [
      {
        step: 'UNF',
        ruleCardTitle: 'Unnormalized Form (UNF)',
        ruleCardBody:
          'The source table before normalization. Identify the columns and understand what data is being tracked before applying normal forms.',
        hints: [],
        correctAnswer: [],
        unfViolatingColumns: [],
      },
      {
        step: '1NF',
        ruleCardTitle: 'First Normal Form (1NF)',
        ruleCardBody:
          'All columns must hold atomic values, and each row must be uniquely identified by a primary key (or composite key).',
        hints: [
          'First Normal Form requires identifying a primary key. Look for a combination of columns that uniquely identifies each row.',
          'The combination of StudentID and CourseID uniquely identifies each row.',
          'Composite PK: (StudentID, CourseID). Declare FDs: StudentID → StudentName; CourseID → CourseName, InstructorID, InstructorName; StudentID, CourseID → Grade.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'StudentID', isPK: true },
              { name: 'StudentName', isPK: false },
              { name: 'CourseID', isPK: true },
              { name: 'CourseName', isPK: false },
              { name: 'InstructorID', isPK: false },
              { name: 'InstructorName', isPK: false },
              { name: 'Grade', isPK: false },
            ],
            fds: [
              { lhs: ['StudentID'], rhs: ['StudentName'] },
              { lhs: ['CourseID'], rhs: ['CourseName', 'InstructorID', 'InstructorName'] },
              { lhs: ['StudentID', 'CourseID'], rhs: ['Grade'] },
            ],
          },
        ],
        unfViolatingColumns: ['StudentID', 'CourseID'],
      },
      {
        step: '2NF',
        ruleCardTitle: 'Second Normal Form (2NF)',
        ruleCardBody:
          'Remove partial dependencies. Every non-key column must depend on the full composite key, not just part of it.',
        hints: [
          'Identify which non-key columns depend on only StudentID, and which depend on only CourseID.',
          'StudentName depends only on StudentID. CourseName, InstructorID, and InstructorName depend only on CourseID.',
          'Decompose into: Student(StudentID, StudentName), Course(CourseID, CourseName, InstructorID, InstructorName), Enrollment(StudentID, CourseID, Grade).',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'StudentID', isPK: true },
              { name: 'StudentName', isPK: false },
            ],
            fds: [{ lhs: ['StudentID'], rhs: ['StudentName'] }],
          },
          {
            columns: [
              { name: 'CourseID', isPK: true },
              { name: 'CourseName', isPK: false },
              { name: 'InstructorID', isPK: false },
              { name: 'InstructorName', isPK: false },
            ],
            fds: [{ lhs: ['CourseID'], rhs: ['CourseName', 'InstructorID', 'InstructorName'] }],
          },
          {
            columns: [
              { name: 'StudentID', isPK: true },
              { name: 'CourseID', isPK: true },
              { name: 'Grade', isPK: false },
            ],
            fds: [{ lhs: ['StudentID', 'CourseID'], rhs: ['Grade'] }],
          },
        ],
        unfViolatingColumns: ['StudentName', 'CourseName', 'InstructorID', 'InstructorName'],
      },
      {
        step: '3NF',
        ruleCardTitle: 'Third Normal Form (3NF)',
        ruleCardBody:
          'Remove transitive dependencies. No non-key column should be determined by another non-key column.',
        hints: [
          'Look for a column that depends on another non-key column, not directly on the primary key.',
          'In the Course table, InstructorID → InstructorName. InstructorName is transitively dependent on CourseID via InstructorID.',
          'Decompose Course into Course(CourseID, CourseName, InstructorID) and Instructor(InstructorID, InstructorName). Student and Enrollment remain unchanged.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'StudentID', isPK: true },
              { name: 'StudentName', isPK: false },
            ],
            fds: [{ lhs: ['StudentID'], rhs: ['StudentName'] }],
          },
          {
            columns: [
              { name: 'CourseID', isPK: true },
              { name: 'CourseName', isPK: false },
              { name: 'InstructorID', isPK: false },
            ],
            fds: [{ lhs: ['CourseID'], rhs: ['CourseName', 'InstructorID'] }],
          },
          {
            columns: [
              { name: 'InstructorID', isPK: true },
              { name: 'InstructorName', isPK: false },
            ],
            fds: [{ lhs: ['InstructorID'], rhs: ['InstructorName'] }],
          },
          {
            columns: [
              { name: 'StudentID', isPK: true },
              { name: 'CourseID', isPK: true },
              { name: 'Grade', isPK: false },
            ],
            fds: [{ lhs: ['StudentID', 'CourseID'], rhs: ['Grade'] }],
          },
        ],
        unfViolatingColumns: ['InstructorName'],
      },
    ],
  },
  {
    id: 'order-item',
    title: 'Order & Item',
    description: 'Normalize an order table that includes customer info, product details, and quantities.',
    unfTable: {
      columns: ['OrderID', 'CustomerID', 'CustomerName', 'CustomerCity', 'ProductID', 'ProductName', 'Qty', 'UnitPrice'],
      rows: [
        { OrderID: 'O01', CustomerID: 'C01', CustomerName: 'Alice', CustomerCity: 'NYC', ProductID: 'P01', ProductName: 'Widget', Qty: '2', UnitPrice: '9.99' },
        { OrderID: 'O01', CustomerID: 'C01', CustomerName: 'Alice', CustomerCity: 'NYC', ProductID: 'P02', ProductName: 'Gadget', Qty: '1', UnitPrice: '24.99' },
        { OrderID: 'O02', CustomerID: 'C02', CustomerName: 'Bob', CustomerCity: 'LA', ProductID: 'P01', ProductName: 'Widget', Qty: '5', UnitPrice: '9.99' },
      ],
    },
    steps: [
      {
        step: 'UNF',
        ruleCardTitle: 'Unnormalized Form (UNF)',
        ruleCardBody:
          'Examine the source table. Notice how customer and product data repeat across rows for the same order.',
        hints: [],
        correctAnswer: [],
        unfViolatingColumns: [],
      },
      {
        step: '1NF',
        ruleCardTitle: 'First Normal Form (1NF)',
        ruleCardBody:
          'Ensure all values are atomic and each row has a primary key. A composite key may be needed if no single column uniquely identifies each row.',
        hints: [
          'No single column uniquely identifies a row — a combination of OrderID and ProductID forms the primary key.',
          'The composite PK is (OrderID, ProductID). Non-key attributes partially depend on sub-keys.',
          'Declare FDs: OrderID → CustomerID, CustomerName, CustomerCity; ProductID → ProductName, UnitPrice; OrderID, ProductID → Qty.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'OrderID', isPK: true },
              { name: 'CustomerID', isPK: false },
              { name: 'CustomerName', isPK: false },
              { name: 'CustomerCity', isPK: false },
              { name: 'ProductID', isPK: true },
              { name: 'ProductName', isPK: false },
              { name: 'Qty', isPK: false },
              { name: 'UnitPrice', isPK: false },
            ],
            fds: [
              { lhs: ['OrderID'], rhs: ['CustomerID', 'CustomerName', 'CustomerCity'] },
              { lhs: ['ProductID'], rhs: ['ProductName', 'UnitPrice'] },
              { lhs: ['OrderID', 'ProductID'], rhs: ['Qty'] },
            ],
          },
        ],
        unfViolatingColumns: ['OrderID', 'ProductID'],
      },
      {
        step: '2NF',
        ruleCardTitle: 'Second Normal Form (2NF)',
        ruleCardBody:
          'Eliminate partial dependencies. Split columns that depend on only part of the composite key into separate tables.',
        hints: [
          'Identify which columns depend only on OrderID and which depend only on ProductID.',
          'CustomerID, CustomerName, CustomerCity depend on OrderID only. ProductName, UnitPrice depend on ProductID only.',
          'Create: Customer(CustomerID, CustomerName, CustomerCity), Order(OrderID, CustomerID), Product(ProductID, ProductName, UnitPrice), OrderItem(OrderID, ProductID, Qty).',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'CustomerID', isPK: true },
              { name: 'CustomerName', isPK: false },
              { name: 'CustomerCity', isPK: false },
            ],
            fds: [{ lhs: ['CustomerID'], rhs: ['CustomerName', 'CustomerCity'] }],
          },
          {
            columns: [
              { name: 'OrderID', isPK: true },
              { name: 'CustomerID', isPK: false },
            ],
            fds: [{ lhs: ['OrderID'], rhs: ['CustomerID'] }],
          },
          {
            columns: [
              { name: 'ProductID', isPK: true },
              { name: 'ProductName', isPK: false },
              { name: 'UnitPrice', isPK: false },
            ],
            fds: [{ lhs: ['ProductID'], rhs: ['ProductName', 'UnitPrice'] }],
          },
          {
            columns: [
              { name: 'OrderID', isPK: true },
              { name: 'ProductID', isPK: true },
              { name: 'Qty', isPK: false },
            ],
            fds: [{ lhs: ['OrderID', 'ProductID'], rhs: ['Qty'] }],
          },
        ],
        unfViolatingColumns: ['CustomerName', 'CustomerCity', 'ProductName', 'UnitPrice'],
      },
      {
        step: '3NF',
        ruleCardTitle: 'Third Normal Form (3NF)',
        ruleCardBody:
          'Remove transitive dependencies. All non-key attributes must depend directly on the primary key.',
        hints: [
          'Check each table from 2NF for transitive dependencies (non-key → non-key).',
          'The Customer table has CustomerID → CustomerName, CustomerCity — no transitive dependency there. All 2NF tables are already in 3NF for this exercise.',
          'No further decomposition is needed. The 4 tables from 2NF (Customer, Order, Product, OrderItem) are already in 3NF.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'CustomerID', isPK: true },
              { name: 'CustomerName', isPK: false },
              { name: 'CustomerCity', isPK: false },
            ],
            fds: [{ lhs: ['CustomerID'], rhs: ['CustomerName', 'CustomerCity'] }],
          },
          {
            columns: [
              { name: 'OrderID', isPK: true },
              { name: 'CustomerID', isPK: false },
            ],
            fds: [{ lhs: ['OrderID'], rhs: ['CustomerID'] }],
          },
          {
            columns: [
              { name: 'ProductID', isPK: true },
              { name: 'ProductName', isPK: false },
              { name: 'UnitPrice', isPK: false },
            ],
            fds: [{ lhs: ['ProductID'], rhs: ['ProductName', 'UnitPrice'] }],
          },
          {
            columns: [
              { name: 'OrderID', isPK: true },
              { name: 'ProductID', isPK: true },
              { name: 'Qty', isPK: false },
            ],
            fds: [{ lhs: ['OrderID', 'ProductID'], rhs: ['Qty'] }],
          },
        ],
        unfViolatingColumns: [],
      },
    ],
  },
  // ─── HARD EXERCISES ───────────────────────────────────────────────────────────
  {
    id: 'hospital-scheduling',
    title: 'Hospital Scheduling',
    description: 'A hospital scheduling table tracking patients, their doctors, ward assignments, procedures, and billing. Multiple partial and transitive dependencies across a wide composite key.',
    unfTable: {
      columns: ['PatientID', 'PatientName', 'DOB', 'DoctorID', 'DoctorName', 'Specialty', 'WardID', 'WardName', 'WardFloor', 'ProcCode', 'ProcName', 'ProcDate', 'Fee'],
      rows: [
        { PatientID: 'P01', PatientName: 'Alice Brown', DOB: '1990-03-12', DoctorID: 'D01', DoctorName: 'Dr. Chen', Specialty: 'Cardiology', WardID: 'W02', WardName: 'Cardiac', WardFloor: '3', ProcCode: 'PR01', ProcName: 'ECG', ProcDate: '2024-01-10', Fee: '200' },
        { PatientID: 'P01', PatientName: 'Alice Brown', DOB: '1990-03-12', DoctorID: 'D01', DoctorName: 'Dr. Chen', Specialty: 'Cardiology', WardID: 'W02', WardName: 'Cardiac', WardFloor: '3', ProcCode: 'PR02', ProcName: 'Echo', ProcDate: '2024-01-11', Fee: '350' },
        { PatientID: 'P02', PatientName: 'Bob Davis', DOB: '1975-07-22', DoctorID: 'D02', DoctorName: 'Dr. Patel', Specialty: 'Neurology', WardID: 'W03', WardName: 'Neuro', WardFloor: '4', ProcCode: 'PR03', ProcName: 'MRI', ProcDate: '2024-01-12', Fee: '800' },
        { PatientID: 'P02', PatientName: 'Bob Davis', DOB: '1975-07-22', DoctorID: 'D01', DoctorName: 'Dr. Chen', Specialty: 'Cardiology', WardID: 'W02', WardName: 'Cardiac', WardFloor: '3', ProcCode: 'PR01', ProcName: 'ECG', ProcDate: '2024-01-13', Fee: '200' },
      ],
    },
    steps: [
      {
        step: 'UNF',
        ruleCardTitle: 'Unnormalized Form (UNF)',
        ruleCardBody: 'A wide hospital scheduling table with patient, doctor, ward, and procedure data in one flat structure. Notice how patient and doctor details repeat for every procedure row.',
        hints: [],
        correctAnswer: [],
        unfViolatingColumns: [],
      },
      {
        step: '1NF',
        ruleCardTitle: 'First Normal Form (1NF)',
        ruleCardBody: 'All values are already atomic. The challenge is identifying the correct composite primary key across four interacting entities.',
        hints: [
          'Each row represents a specific patient receiving a specific procedure on a specific date from a specific doctor. What combination of columns makes each row unique?',
          'The composite PK is (PatientID, DoctorID, ProcCode, ProcDate). The same patient could receive the same procedure from different doctors, or the same procedure twice on different dates.',
          'FDs: PatientID → PatientName, DOB; DoctorID → DoctorName, Specialty; WardID → WardName, WardFloor; ProcCode → ProcName, Fee; PatientID+DoctorID → WardID.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'PatientID', isPK: true },
              { name: 'PatientName', isPK: false },
              { name: 'DOB', isPK: false },
              { name: 'DoctorID', isPK: true },
              { name: 'DoctorName', isPK: false },
              { name: 'Specialty', isPK: false },
              { name: 'WardID', isPK: false },
              { name: 'WardName', isPK: false },
              { name: 'WardFloor', isPK: false },
              { name: 'ProcCode', isPK: true },
              { name: 'ProcName', isPK: false },
              { name: 'ProcDate', isPK: true },
              { name: 'Fee', isPK: false },
            ],
            fds: [
              { lhs: ['PatientID'], rhs: ['PatientName', 'DOB'] },
              { lhs: ['DoctorID'], rhs: ['DoctorName', 'Specialty'] },
              { lhs: ['WardID'], rhs: ['WardName', 'WardFloor'] },
              { lhs: ['ProcCode'], rhs: ['ProcName', 'Fee'] },
              { lhs: ['PatientID', 'DoctorID'], rhs: ['WardID'] },
            ],
          },
        ],
        unfViolatingColumns: ['PatientID', 'DoctorID', 'ProcCode', 'ProcDate'],
      },
      {
        step: '2NF',
        ruleCardTitle: 'Second Normal Form (2NF)',
        ruleCardBody: 'Remove all partial dependencies. Every non-key column must depend on the entire 4-part composite key.',
        hints: [
          'With a 4-column composite key, many columns depend on only 1 or 2 of those key parts. What depends on PatientID alone? DoctorID alone? ProcCode alone? PatientID+DoctorID?',
          'PatientName/DOB depend only on PatientID. DoctorName/Specialty depend only on DoctorID. ProcName/Fee depend only on ProcCode. WardID/WardName/WardFloor depend on PatientID+DoctorID.',
          'Tables: Patient(PatientID, PatientName, DOB), Doctor(DoctorID, DoctorName, Specialty), Procedure(ProcCode, ProcName, Fee), PatientDoctor(PatientID, DoctorID, WardID, WardName, WardFloor), Appointment(PatientID, DoctorID, ProcCode, ProcDate).',
        ],
        correctAnswer: [
          {
            columns: [{ name: 'PatientID', isPK: true }, { name: 'PatientName', isPK: false }, { name: 'DOB', isPK: false }],
            fds: [{ lhs: ['PatientID'], rhs: ['PatientName', 'DOB'] }],
          },
          {
            columns: [{ name: 'DoctorID', isPK: true }, { name: 'DoctorName', isPK: false }, { name: 'Specialty', isPK: false }],
            fds: [{ lhs: ['DoctorID'], rhs: ['DoctorName', 'Specialty'] }],
          },
          {
            columns: [{ name: 'ProcCode', isPK: true }, { name: 'ProcName', isPK: false }, { name: 'Fee', isPK: false }],
            fds: [{ lhs: ['ProcCode'], rhs: ['ProcName', 'Fee'] }],
          },
          {
            columns: [
              { name: 'PatientID', isPK: true }, { name: 'DoctorID', isPK: true },
              { name: 'WardID', isPK: false }, { name: 'WardName', isPK: false }, { name: 'WardFloor', isPK: false },
            ],
            fds: [
              { lhs: ['PatientID', 'DoctorID'], rhs: ['WardID'] },
              { lhs: ['WardID'], rhs: ['WardName', 'WardFloor'] },
            ],
          },
          {
            columns: [
              { name: 'PatientID', isPK: true }, { name: 'DoctorID', isPK: true },
              { name: 'ProcCode', isPK: true }, { name: 'ProcDate', isPK: true },
            ],
            fds: [],
          },
        ],
        unfViolatingColumns: ['PatientName', 'DOB', 'DoctorName', 'Specialty', 'ProcName', 'Fee', 'WardName', 'WardFloor'],
      },
      {
        step: '3NF',
        ruleCardTitle: 'Third Normal Form (3NF)',
        ruleCardBody: 'Remove transitive dependencies. Look at the PatientDoctor table: does WardName depend on the PK, or on another non-key column?',
        hints: [
          'In the PatientDoctor table: WardName and WardFloor depend on WardID, not on (PatientID, DoctorID). That is a transitive dependency.',
          'Extract Ward(WardID, WardName, WardFloor). Update PatientDoctor to only PatientDoctor(PatientID, DoctorID, WardID).',
          'Final 6 tables: Patient, Doctor, Procedure, Ward, PatientDoctor(PatientID, DoctorID, WardID), Appointment(PatientID, DoctorID, ProcCode, ProcDate).',
        ],
        correctAnswer: [
          {
            columns: [{ name: 'PatientID', isPK: true }, { name: 'PatientName', isPK: false }, { name: 'DOB', isPK: false }],
            fds: [{ lhs: ['PatientID'], rhs: ['PatientName', 'DOB'] }],
          },
          {
            columns: [{ name: 'DoctorID', isPK: true }, { name: 'DoctorName', isPK: false }, { name: 'Specialty', isPK: false }],
            fds: [{ lhs: ['DoctorID'], rhs: ['DoctorName', 'Specialty'] }],
          },
          {
            columns: [{ name: 'ProcCode', isPK: true }, { name: 'ProcName', isPK: false }, { name: 'Fee', isPK: false }],
            fds: [{ lhs: ['ProcCode'], rhs: ['ProcName', 'Fee'] }],
          },
          {
            columns: [{ name: 'WardID', isPK: true }, { name: 'WardName', isPK: false }, { name: 'WardFloor', isPK: false }],
            fds: [{ lhs: ['WardID'], rhs: ['WardName', 'WardFloor'] }],
          },
          {
            columns: [{ name: 'PatientID', isPK: true }, { name: 'DoctorID', isPK: true }, { name: 'WardID', isPK: false }],
            fds: [{ lhs: ['PatientID', 'DoctorID'], rhs: ['WardID'] }],
          },
          {
            columns: [{ name: 'PatientID', isPK: true }, { name: 'DoctorID', isPK: true }, { name: 'ProcCode', isPK: true }, { name: 'ProcDate', isPK: true }],
            fds: [],
          },
        ],
        unfViolatingColumns: ['WardName', 'WardFloor'],
      },
    ],
  },
  {
    id: 'university-enrollment',
    title: 'University Enrollment',
    description: 'Student enrollments, course sections, rooms, professors, and grades — with multi-level transitive dependency chains to untangle all the way to 3NF.',
    unfTable: {
      columns: ['StudentID', 'StudentName', 'MajorCode', 'MajorName', 'AdvisorID', 'AdvisorName', 'SectionID', 'CourseID', 'CourseName', 'Credits', 'ProfID', 'ProfName', 'RoomID', 'Building', 'Capacity', 'Grade'],
      rows: [
        { StudentID: 'S01', StudentName: 'Emma', MajorCode: 'CS', MajorName: 'Comp. Sci', AdvisorID: 'A01', AdvisorName: 'Prof. Liu', SectionID: 'SEC01', CourseID: 'CS301', CourseName: 'Databases', Credits: '3', ProfID: 'P01', ProfName: 'Dr. Kim', RoomID: 'R101', Building: 'Tech Hall', Capacity: '30', Grade: 'A' },
        { StudentID: 'S01', StudentName: 'Emma', MajorCode: 'CS', MajorName: 'Comp. Sci', AdvisorID: 'A01', AdvisorName: 'Prof. Liu', SectionID: 'SEC02', CourseID: 'CS401', CourseName: 'AI', Credits: '3', ProfID: 'P02', ProfName: 'Dr. Roy', RoomID: 'R202', Building: 'Sci Center', Capacity: '25', Grade: 'B+' },
        { StudentID: 'S02', StudentName: 'Liam', MajorCode: 'MATH', MajorName: 'Mathematics', AdvisorID: 'A02', AdvisorName: 'Prof. Grant', SectionID: 'SEC01', CourseID: 'CS301', CourseName: 'Databases', Credits: '3', ProfID: 'P01', ProfName: 'Dr. Kim', RoomID: 'R101', Building: 'Tech Hall', Capacity: '30', Grade: 'B' },
      ],
    },
    steps: [
      {
        step: 'UNF',
        ruleCardTitle: 'Unnormalized Form (UNF)',
        ruleCardBody: 'This enrollment record flattens student, major, advisor, section, course, professor, and room data into one wide table. Count the distinct entities before starting.',
        hints: [],
        correctAnswer: [],
        unfViolatingColumns: [],
      },
      {
        step: '1NF',
        ruleCardTitle: 'First Normal Form (1NF)',
        ruleCardBody: 'All values are already atomic. Identify the composite PK that uniquely identifies each enrollment row.',
        hints: [
          'A student can enroll in multiple sections, and a section has many students. What two columns together uniquely identify each row?',
          'PK: (StudentID, SectionID). Only Grade truly needs both.',
          'FDs: StudentID → StudentName, MajorCode; MajorCode → MajorName, AdvisorID; AdvisorID → AdvisorName; SectionID → CourseID, ProfID, RoomID; CourseID → CourseName, Credits; ProfID → ProfName; RoomID → Building, Capacity; StudentID+SectionID → Grade.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'StudentID', isPK: true }, { name: 'StudentName', isPK: false }, { name: 'MajorCode', isPK: false },
              { name: 'MajorName', isPK: false }, { name: 'AdvisorID', isPK: false }, { name: 'AdvisorName', isPK: false },
              { name: 'SectionID', isPK: true }, { name: 'CourseID', isPK: false }, { name: 'CourseName', isPK: false },
              { name: 'Credits', isPK: false }, { name: 'ProfID', isPK: false }, { name: 'ProfName', isPK: false },
              { name: 'RoomID', isPK: false }, { name: 'Building', isPK: false }, { name: 'Capacity', isPK: false },
              { name: 'Grade', isPK: false },
            ],
            fds: [
              { lhs: ['StudentID'], rhs: ['StudentName', 'MajorCode'] },
              { lhs: ['MajorCode'], rhs: ['MajorName', 'AdvisorID'] },
              { lhs: ['AdvisorID'], rhs: ['AdvisorName'] },
              { lhs: ['SectionID'], rhs: ['CourseID', 'ProfID', 'RoomID'] },
              { lhs: ['CourseID'], rhs: ['CourseName', 'Credits'] },
              { lhs: ['ProfID'], rhs: ['ProfName'] },
              { lhs: ['RoomID'], rhs: ['Building', 'Capacity'] },
              { lhs: ['StudentID', 'SectionID'], rhs: ['Grade'] },
            ],
          },
        ],
        unfViolatingColumns: ['StudentID', 'SectionID'],
      },
      {
        step: '2NF',
        ruleCardTitle: 'Second Normal Form (2NF)',
        ruleCardBody: 'Remove partial dependencies. Columns that depend on StudentID alone or SectionID alone must move to their own tables.',
        hints: [
          'What depends only on StudentID? What depends only on SectionID? Only Grade needs both.',
          'StudentID alone → StudentName, MajorCode, MajorName, AdvisorID, AdvisorName. SectionID alone → CourseID, CourseName, Credits, ProfID, ProfName, RoomID, Building, Capacity.',
          'Tables: Student(StudentID, StudentName, MajorCode, MajorName, AdvisorID, AdvisorName), Section(SectionID, CourseID, CourseName, Credits, ProfID, ProfName, RoomID, Building, Capacity), Enrollment(StudentID, SectionID, Grade).',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'StudentID', isPK: true }, { name: 'StudentName', isPK: false }, { name: 'MajorCode', isPK: false },
              { name: 'MajorName', isPK: false }, { name: 'AdvisorID', isPK: false }, { name: 'AdvisorName', isPK: false },
            ],
            fds: [
              { lhs: ['StudentID'], rhs: ['StudentName', 'MajorCode'] },
              { lhs: ['MajorCode'], rhs: ['MajorName', 'AdvisorID'] },
              { lhs: ['AdvisorID'], rhs: ['AdvisorName'] },
            ],
          },
          {
            columns: [
              { name: 'SectionID', isPK: true }, { name: 'CourseID', isPK: false }, { name: 'CourseName', isPK: false },
              { name: 'Credits', isPK: false }, { name: 'ProfID', isPK: false }, { name: 'ProfName', isPK: false },
              { name: 'RoomID', isPK: false }, { name: 'Building', isPK: false }, { name: 'Capacity', isPK: false },
            ],
            fds: [
              { lhs: ['SectionID'], rhs: ['CourseID', 'ProfID', 'RoomID'] },
              { lhs: ['CourseID'], rhs: ['CourseName', 'Credits'] },
              { lhs: ['ProfID'], rhs: ['ProfName'] },
              { lhs: ['RoomID'], rhs: ['Building', 'Capacity'] },
            ],
          },
          {
            columns: [{ name: 'StudentID', isPK: true }, { name: 'SectionID', isPK: true }, { name: 'Grade', isPK: false }],
            fds: [{ lhs: ['StudentID', 'SectionID'], rhs: ['Grade'] }],
          },
        ],
        unfViolatingColumns: ['StudentName', 'MajorCode', 'MajorName', 'AdvisorID', 'AdvisorName', 'CourseName', 'Credits', 'ProfName', 'Building', 'Capacity'],
      },
      {
        step: '3NF',
        ruleCardTitle: 'Third Normal Form (3NF)',
        ruleCardBody: 'Both the Student and Section tables still have transitive chains. Each chain becomes its own table.',
        hints: [
          'Student table: StudentID → MajorCode → MajorName, AdvisorID → AdvisorName (two chains). Section table: SectionID → CourseID → CourseName/Credits; SectionID → ProfID → ProfName; SectionID → RoomID → Building/Capacity.',
          'Each transitive chain needs its own lookup table. You will end up with 8 tables total.',
          'Final tables: Student(StudentID, StudentName, MajorCode), Major(MajorCode, MajorName, AdvisorID), Advisor(AdvisorID, AdvisorName), Section(SectionID, CourseID, ProfID, RoomID), Course(CourseID, CourseName, Credits), Professor(ProfID, ProfName), Room(RoomID, Building, Capacity), Enrollment(StudentID, SectionID, Grade).',
        ],
        correctAnswer: [
          { columns: [{ name: 'StudentID', isPK: true }, { name: 'StudentName', isPK: false }, { name: 'MajorCode', isPK: false }], fds: [{ lhs: ['StudentID'], rhs: ['StudentName', 'MajorCode'] }] },
          { columns: [{ name: 'MajorCode', isPK: true }, { name: 'MajorName', isPK: false }, { name: 'AdvisorID', isPK: false }], fds: [{ lhs: ['MajorCode'], rhs: ['MajorName', 'AdvisorID'] }] },
          { columns: [{ name: 'AdvisorID', isPK: true }, { name: 'AdvisorName', isPK: false }], fds: [{ lhs: ['AdvisorID'], rhs: ['AdvisorName'] }] },
          { columns: [{ name: 'SectionID', isPK: true }, { name: 'CourseID', isPK: false }, { name: 'ProfID', isPK: false }, { name: 'RoomID', isPK: false }], fds: [{ lhs: ['SectionID'], rhs: ['CourseID', 'ProfID', 'RoomID'] }] },
          { columns: [{ name: 'CourseID', isPK: true }, { name: 'CourseName', isPK: false }, { name: 'Credits', isPK: false }], fds: [{ lhs: ['CourseID'], rhs: ['CourseName', 'Credits'] }] },
          { columns: [{ name: 'ProfID', isPK: true }, { name: 'ProfName', isPK: false }], fds: [{ lhs: ['ProfID'], rhs: ['ProfName'] }] },
          { columns: [{ name: 'RoomID', isPK: true }, { name: 'Building', isPK: false }, { name: 'Capacity', isPK: false }], fds: [{ lhs: ['RoomID'], rhs: ['Building', 'Capacity'] }] },
          { columns: [{ name: 'StudentID', isPK: true }, { name: 'SectionID', isPK: true }, { name: 'Grade', isPK: false }], fds: [{ lhs: ['StudentID', 'SectionID'], rhs: ['Grade'] }] },
        ],
        unfViolatingColumns: ['MajorName', 'AdvisorID', 'AdvisorName', 'CourseName', 'Credits', 'ProfName', 'Building', 'Capacity'],
      },
    ],
  },
  {
    id: 'retail-supply-chain',
    title: 'Retail Supply Chain',
    description: 'A denormalized retail record combining supplier contracts, product shipments, warehouse locations, store orders, and discount tiers. The most complex decomposition in this set.',
    unfTable: {
      columns: ['SupplierID', 'SupplierName', 'SupplierCity', 'ContractID', 'ContractStart', 'ContractEnd', 'ProductID', 'ProductName', 'CategoryID', 'CategoryName', 'WarehouseID', 'WarehouseCity', 'StoreID', 'StoreName', 'StoreRegion', 'OrderID', 'OrderDate', 'OrderQty', 'UnitCost', 'DiscountTier', 'DiscountPct'],
      rows: [
        { SupplierID: 'SUP01', SupplierName: 'Acme', SupplierCity: 'Chicago', ContractID: 'C01', ContractStart: '2023-01-01', ContractEnd: '2024-12-31', ProductID: 'PRD01', ProductName: 'Widget', CategoryID: 'CAT01', CategoryName: 'Hardware', WarehouseID: 'WH01', WarehouseCity: 'Dallas', StoreID: 'ST01', StoreName: 'Main St', StoreRegion: 'South', OrderID: 'ORD01', OrderDate: '2024-02-10', OrderQty: '50', UnitCost: '5.00', DiscountTier: 'Gold', DiscountPct: '15' },
        { SupplierID: 'SUP01', SupplierName: 'Acme', SupplierCity: 'Chicago', ContractID: 'C01', ContractStart: '2023-01-01', ContractEnd: '2024-12-31', ProductID: 'PRD02', ProductName: 'Gadget', CategoryID: 'CAT02', CategoryName: 'Electronics', WarehouseID: 'WH01', WarehouseCity: 'Dallas', StoreID: 'ST02', StoreName: 'Plaza', StoreRegion: 'North', OrderID: 'ORD02', OrderDate: '2024-02-11', OrderQty: '20', UnitCost: '18.00', DiscountTier: 'Silver', DiscountPct: '10' },
        { SupplierID: 'SUP02', SupplierName: 'Beta Co', SupplierCity: 'Austin', ContractID: 'C02', ContractStart: '2024-01-01', ContractEnd: '2025-12-31', ProductID: 'PRD01', ProductName: 'Widget', CategoryID: 'CAT01', CategoryName: 'Hardware', WarehouseID: 'WH02', WarehouseCity: 'Denver', StoreID: 'ST01', StoreName: 'Main St', StoreRegion: 'South', OrderID: 'ORD03', OrderDate: '2024-02-15', OrderQty: '100', UnitCost: '4.80', DiscountTier: 'Gold', DiscountPct: '15' },
      ],
    },
    steps: [
      {
        step: 'UNF',
        ruleCardTitle: 'Unnormalized Form (UNF)',
        ruleCardBody: 'This table mixes six distinct entities: suppliers, contracts, products, categories, warehouses, stores, and orders. Identify each entity and its columns before normalizing.',
        hints: [],
        correctAnswer: [],
        unfViolatingColumns: [],
      },
      {
        step: '1NF',
        ruleCardTitle: 'First Normal Form (1NF)',
        ruleCardBody: 'All values are atomic. The challenge here is identifying the correct composite primary key across the six interacting entities.',
        hints: [
          'Each row is a specific product on a specific order. What pair of columns uniquely identifies an order line?',
          'PK: (OrderID, ProductID). The same order can include multiple products; the same product can appear on multiple orders.',
          'Key FDs: OrderID → StoreID, OrderDate, ContractID, WarehouseID, DiscountTier; ContractID → SupplierID, ContractStart, ContractEnd; SupplierID → SupplierName, SupplierCity; ProductID → ProductName, CategoryID; CategoryID → CategoryName; WarehouseID → WarehouseCity; StoreID → StoreName, StoreRegion; DiscountTier → DiscountPct; OrderID+ProductID → OrderQty, UnitCost.',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'SupplierID', isPK: false }, { name: 'SupplierName', isPK: false }, { name: 'SupplierCity', isPK: false },
              { name: 'ContractID', isPK: false }, { name: 'ContractStart', isPK: false }, { name: 'ContractEnd', isPK: false },
              { name: 'ProductID', isPK: true }, { name: 'ProductName', isPK: false }, { name: 'CategoryID', isPK: false }, { name: 'CategoryName', isPK: false },
              { name: 'WarehouseID', isPK: false }, { name: 'WarehouseCity', isPK: false },
              { name: 'StoreID', isPK: false }, { name: 'StoreName', isPK: false }, { name: 'StoreRegion', isPK: false },
              { name: 'OrderID', isPK: true }, { name: 'OrderDate', isPK: false }, { name: 'OrderQty', isPK: false }, { name: 'UnitCost', isPK: false },
              { name: 'DiscountTier', isPK: false }, { name: 'DiscountPct', isPK: false },
            ],
            fds: [
              { lhs: ['SupplierID'], rhs: ['SupplierName', 'SupplierCity'] },
              { lhs: ['ContractID'], rhs: ['SupplierID', 'ContractStart', 'ContractEnd'] },
              { lhs: ['ProductID'], rhs: ['ProductName', 'CategoryID'] },
              { lhs: ['CategoryID'], rhs: ['CategoryName'] },
              { lhs: ['WarehouseID'], rhs: ['WarehouseCity'] },
              { lhs: ['StoreID'], rhs: ['StoreName', 'StoreRegion'] },
              { lhs: ['DiscountTier'], rhs: ['DiscountPct'] },
              { lhs: ['OrderID'], rhs: ['StoreID', 'OrderDate', 'ContractID', 'WarehouseID', 'DiscountTier'] },
              { lhs: ['OrderID', 'ProductID'], rhs: ['OrderQty', 'UnitCost'] },
            ],
          },
        ],
        unfViolatingColumns: ['OrderID', 'ProductID'],
      },
      {
        step: '2NF',
        ruleCardTitle: 'Second Normal Form (2NF)',
        ruleCardBody: 'Remove partial dependencies. Many columns depend on OrderID alone or ProductID alone. Only OrderQty and UnitCost truly need the full composite key.',
        hints: [
          'Group by key dependency: what depends only on ProductID? Only on OrderID? On both?',
          'ProductID alone → ProductName, CategoryID, CategoryName. OrderID alone → StoreID, StoreName, StoreRegion, OrderDate, ContractID, SupplierID, SupplierName, SupplierCity, ContractStart, ContractEnd, WarehouseID, WarehouseCity, DiscountTier, DiscountPct.',
          'Tables: Product(ProductID, ProductName, CategoryID, CategoryName), Order(OrderID, StoreID, StoreName, StoreRegion, OrderDate, ContractID, SupplierID, SupplierName, SupplierCity, ContractStart, ContractEnd, WarehouseID, WarehouseCity, DiscountTier, DiscountPct), OrderLine(OrderID, ProductID, OrderQty, UnitCost).',
        ],
        correctAnswer: [
          {
            columns: [
              { name: 'ProductID', isPK: true }, { name: 'ProductName', isPK: false },
              { name: 'CategoryID', isPK: false }, { name: 'CategoryName', isPK: false },
            ],
            fds: [
              { lhs: ['ProductID'], rhs: ['ProductName', 'CategoryID'] },
              { lhs: ['CategoryID'], rhs: ['CategoryName'] },
            ],
          },
          {
            columns: [
              { name: 'OrderID', isPK: true }, { name: 'StoreID', isPK: false }, { name: 'StoreName', isPK: false }, { name: 'StoreRegion', isPK: false },
              { name: 'OrderDate', isPK: false }, { name: 'ContractID', isPK: false }, { name: 'SupplierID', isPK: false },
              { name: 'SupplierName', isPK: false }, { name: 'SupplierCity', isPK: false }, { name: 'ContractStart', isPK: false }, { name: 'ContractEnd', isPK: false },
              { name: 'WarehouseID', isPK: false }, { name: 'WarehouseCity', isPK: false },
              { name: 'DiscountTier', isPK: false }, { name: 'DiscountPct', isPK: false },
            ],
            fds: [
              { lhs: ['OrderID'], rhs: ['StoreID', 'OrderDate', 'ContractID', 'WarehouseID', 'DiscountTier'] },
              { lhs: ['StoreID'], rhs: ['StoreName', 'StoreRegion'] },
              { lhs: ['ContractID'], rhs: ['SupplierID', 'ContractStart', 'ContractEnd'] },
              { lhs: ['SupplierID'], rhs: ['SupplierName', 'SupplierCity'] },
              { lhs: ['WarehouseID'], rhs: ['WarehouseCity'] },
              { lhs: ['DiscountTier'], rhs: ['DiscountPct'] },
            ],
          },
          {
            columns: [{ name: 'OrderID', isPK: true }, { name: 'ProductID', isPK: true }, { name: 'OrderQty', isPK: false }, { name: 'UnitCost', isPK: false }],
            fds: [{ lhs: ['OrderID', 'ProductID'], rhs: ['OrderQty', 'UnitCost'] }],
          },
        ],
        unfViolatingColumns: ['ProductName', 'CategoryID', 'CategoryName', 'StoreName', 'StoreRegion', 'SupplierName', 'SupplierCity', 'ContractStart', 'ContractEnd', 'WarehouseCity'],
      },
      {
        step: '3NF',
        ruleCardTitle: 'Third Normal Form (3NF)',
        ruleCardBody: 'Both the Product and Order tables still have transitive chains. Each entity needs its own table — you will produce 9 tables total.',
        hints: [
          'Product table: ProductID → CategoryID → CategoryName (transitive). Order table: chains through ContractID → SupplierID → SupplierName/SupplierCity; StoreID → StoreName/StoreRegion; WarehouseID → WarehouseCity; DiscountTier → DiscountPct.',
          'Each transitive chain becomes its own lookup table. The Order table becomes a thin linking record with only foreign keys.',
          'Final 9 tables: Product(ProductID, ProductName, CategoryID), Category(CategoryID, CategoryName), Supplier(SupplierID, SupplierName, SupplierCity), Contract(ContractID, SupplierID, ContractStart, ContractEnd), Store(StoreID, StoreName, StoreRegion), Warehouse(WarehouseID, WarehouseCity), DiscountTier(DiscountTier, DiscountPct), Order(OrderID, StoreID, OrderDate, ContractID, WarehouseID, DiscountTier), OrderLine(OrderID, ProductID, OrderQty, UnitCost).',
        ],
        correctAnswer: [
          { columns: [{ name: 'ProductID', isPK: true }, { name: 'ProductName', isPK: false }, { name: 'CategoryID', isPK: false }], fds: [{ lhs: ['ProductID'], rhs: ['ProductName', 'CategoryID'] }] },
          { columns: [{ name: 'CategoryID', isPK: true }, { name: 'CategoryName', isPK: false }], fds: [{ lhs: ['CategoryID'], rhs: ['CategoryName'] }] },
          { columns: [{ name: 'SupplierID', isPK: true }, { name: 'SupplierName', isPK: false }, { name: 'SupplierCity', isPK: false }], fds: [{ lhs: ['SupplierID'], rhs: ['SupplierName', 'SupplierCity'] }] },
          { columns: [{ name: 'ContractID', isPK: true }, { name: 'SupplierID', isPK: false }, { name: 'ContractStart', isPK: false }, { name: 'ContractEnd', isPK: false }], fds: [{ lhs: ['ContractID'], rhs: ['SupplierID', 'ContractStart', 'ContractEnd'] }] },
          { columns: [{ name: 'StoreID', isPK: true }, { name: 'StoreName', isPK: false }, { name: 'StoreRegion', isPK: false }], fds: [{ lhs: ['StoreID'], rhs: ['StoreName', 'StoreRegion'] }] },
          { columns: [{ name: 'WarehouseID', isPK: true }, { name: 'WarehouseCity', isPK: false }], fds: [{ lhs: ['WarehouseID'], rhs: ['WarehouseCity'] }] },
          { columns: [{ name: 'DiscountTier', isPK: true }, { name: 'DiscountPct', isPK: false }], fds: [{ lhs: ['DiscountTier'], rhs: ['DiscountPct'] }] },
          {
            columns: [
              { name: 'OrderID', isPK: true }, { name: 'StoreID', isPK: false }, { name: 'OrderDate', isPK: false },
              { name: 'ContractID', isPK: false }, { name: 'WarehouseID', isPK: false }, { name: 'DiscountTier', isPK: false },
            ],
            fds: [{ lhs: ['OrderID'], rhs: ['StoreID', 'OrderDate', 'ContractID', 'WarehouseID', 'DiscountTier'] }],
          },
          { columns: [{ name: 'OrderID', isPK: true }, { name: 'ProductID', isPK: true }, { name: 'OrderQty', isPK: false }, { name: 'UnitCost', isPK: false }], fds: [{ lhs: ['OrderID', 'ProductID'], rhs: ['OrderQty', 'UnitCost'] }] },
        ],
        unfViolatingColumns: ['CategoryName', 'SupplierName', 'SupplierCity', 'StoreName', 'StoreRegion', 'WarehouseCity', 'DiscountPct'],
      },
    ],
  }
]

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id)
}
