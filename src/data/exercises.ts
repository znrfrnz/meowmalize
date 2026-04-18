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
]

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id)
}
