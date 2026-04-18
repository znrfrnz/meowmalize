import type { ErdExercise } from '@/types'

export const erdExercises: ErdExercise[] = [
  {
    id: 'employee-project',
    title: 'Employee-Project ERD',
    description: 'Draw the ERD for a company system tracking employees and their project assignments. An employee works in one department. A department has one head. Employees are assigned to one or more projects. Each project-employee assignment records hours worked.',
    referenceAnswer: {
      entities: [
        {
          id: 'ref-employee', tableName: 'Employee',
          attributes: [
            { id: 'ref-a1', name: 'EmpID', role: 'PK' },
            { id: 'ref-a2', name: 'EmpName', role: 'Attribute' },
            { id: 'ref-a3', name: 'DeptID', role: 'FK' },
          ],
        },
        {
          id: 'ref-department', tableName: 'Department',
          attributes: [
            { id: 'ref-a4', name: 'DeptID', role: 'PK' },
            { id: 'ref-a5', name: 'DeptName', role: 'Attribute' },
            { id: 'ref-a6', name: 'DeptHead', role: 'Attribute' },
          ],
        },
        {
          id: 'ref-project', tableName: 'Project',
          attributes: [
            { id: 'ref-a7', name: 'ProjID', role: 'PK' },
            { id: 'ref-a8', name: 'ProjName', role: 'Attribute' },
          ],
        },
        {
          id: 'ref-assignment', tableName: 'Assignment',
          attributes: [
            { id: 'ref-a9', name: 'EmpID', role: 'PK' },
            { id: 'ref-a10', name: 'ProjID', role: 'PK' },
            { id: 'ref-a11', name: 'Hours', role: 'Attribute' },
          ],
        },
      ],
      relationships: [
        { id: 'ref-r1', sourceEntityId: 'ref-employee', targetEntityId: 'ref-department', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
        { id: 'ref-r2', sourceEntityId: 'ref-assignment', targetEntityId: 'ref-employee', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
        { id: 'ref-r3', sourceEntityId: 'ref-assignment', targetEntityId: 'ref-project', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
      ],
    },
  },
  {
    id: 'student-course',
    title: 'Student-Course ERD',
    description: 'Draw the ERD for a university enrollment system. Students enroll in courses. Each course is taught by one instructor. An enrollment records the grade.',
    referenceAnswer: {
      entities: [
        {
          id: 'ref-student', tableName: 'Student',
          attributes: [
            { id: 'ref-a1', name: 'StudentID', role: 'PK' },
            { id: 'ref-a2', name: 'StudentName', role: 'Attribute' },
          ],
        },
        {
          id: 'ref-course', tableName: 'Course',
          attributes: [
            { id: 'ref-a3', name: 'CourseID', role: 'PK' },
            { id: 'ref-a4', name: 'CourseName', role: 'Attribute' },
            { id: 'ref-a5', name: 'InstructorID', role: 'FK' },
          ],
        },
        {
          id: 'ref-instructor', tableName: 'Instructor',
          attributes: [
            { id: 'ref-a6', name: 'InstructorID', role: 'PK' },
            { id: 'ref-a7', name: 'InstructorName', role: 'Attribute' },
          ],
        },
        {
          id: 'ref-enrollment', tableName: 'Enrollment',
          attributes: [
            { id: 'ref-a8', name: 'StudentID', role: 'PK' },
            { id: 'ref-a9', name: 'CourseID', role: 'PK' },
            { id: 'ref-a10', name: 'Grade', role: 'Attribute' },
          ],
        },
      ],
      relationships: [
        { id: 'ref-r1', sourceEntityId: 'ref-enrollment', targetEntityId: 'ref-student', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
        { id: 'ref-r2', sourceEntityId: 'ref-enrollment', targetEntityId: 'ref-course', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
        { id: 'ref-r3', sourceEntityId: 'ref-course', targetEntityId: 'ref-instructor', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
      ],
    },
  },
  {
    id: 'order-item',
    title: 'Order-Item ERD',
    description: 'Draw the ERD for an e-commerce system. Customers place orders. Each order contains one or more products (with quantity and unit price). A customer lives in one city.',
    referenceAnswer: {
      entities: [
        {
          id: 'ref-customer', tableName: 'Customer',
          attributes: [
            { id: 'ref-a1', name: 'CustomerID', role: 'PK' },
            { id: 'ref-a2', name: 'CustomerName', role: 'Attribute' },
            { id: 'ref-a3', name: 'CustomerCity', role: 'Attribute' },
          ],
        },
        {
          id: 'ref-order', tableName: 'Order',
          attributes: [
            { id: 'ref-a4', name: 'OrderID', role: 'PK' },
            { id: 'ref-a5', name: 'CustomerID', role: 'FK' },
          ],
        },
        {
          id: 'ref-product', tableName: 'Product',
          attributes: [
            { id: 'ref-a6', name: 'ProductID', role: 'PK' },
            { id: 'ref-a7', name: 'ProductName', role: 'Attribute' },
            { id: 'ref-a8', name: 'UnitPrice', role: 'Attribute' },
          ],
        },
        {
          id: 'ref-orderitem', tableName: 'OrderItem',
          attributes: [
            { id: 'ref-a9', name: 'OrderID', role: 'PK' },
            { id: 'ref-a10', name: 'ProductID', role: 'PK' },
            { id: 'ref-a11', name: 'Qty', role: 'Attribute' },
          ],
        },
      ],
      relationships: [
        { id: 'ref-r1', sourceEntityId: 'ref-order', targetEntityId: 'ref-customer', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
        { id: 'ref-r2', sourceEntityId: 'ref-orderitem', targetEntityId: 'ref-order', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
        { id: 'ref-r3', sourceEntityId: 'ref-orderitem', targetEntityId: 'ref-product', sourceCardinality: 'mandatory-many', targetCardinality: 'mandatory-one' },
      ],
    },
  },
]

export function getErdExercise(id: string): ErdExercise | undefined {
  return erdExercises.find((e) => e.id === id)
}
