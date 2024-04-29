#!/usr/bin/env node
import inquirer from "inquirer"

class Student {
    id: string;
    name: string;
    course: string;
    feespaid: number = 0;
    feeForCourse: number= 0
    static counter: number = 1
   constructor(id: string, name: string, course: string, feespaid: number, feeForCourse: number){
      
       this.id = id;
       this.name = name;
       this.course = course;
       this.feespaid = feespaid || 0;
       this.feeForCourse = feeForCourse;
   }
   displayInfo(){
       return `ID ${this.id},
       Name ${this.name}
       Course ${this.course}
       fees Paid ${this.feespaid}
       Remaining Fee ${this.feeForCourse - this.feespaid}` 
   }
   static incrementCounter(){
    Student.counter++
   }
   static generatePaddedId(){
    return String(Student.counter).padStart(5, '0')
   }
   
   tutionFee(amount: number){
    console.log(`${this.name} Deposited ${amount}`)
    const remainingFee = this.feeForCourse - this.feespaid;
    if (amount >= remainingFee) {
        this.feespaid = this.feeForCourse;
        console.log(`You have fully paid your fee for ${this.course} course`);
        console.log(`Remaining Balance: ${amount - remainingFee}`);
    } else if (amount < remainingFee) {
        this.feespaid += amount;
        console.log(`You paid ${amount} towards the fee for ${this.course} course`);
        console.log(`Remaining Fee: ${remainingFee - amount}`);
        console.log(`Remaining Balance: ${remainingFee - this.feespaid}`);
    } else {
        console.log(`Invalid deposit amount.`);
    }
}
}

class StudentManagementSystem {
   student?: any
   students: string[];
   courseFee: number
   courses: string[];
   constructor(){
       this.students = [];
        this.courseFee= 5000
       this.courses = ["GenerativeAI", "Web3", "Blockchain", "Machine Learning", "DeepLearning", "Cloud Computing"]
   }
   displayAllStudents(){
       console.log("---All Students---")
       this.students.forEach((student: any) => console.log(student.displayInfo()))
   }
   async displayStudentStatus(){
        const studentStatus =await inquirer.prompt([{
            type: "input",
            name: "id",
            message: "Enter student id to view student status"
        }])
        let student: any = this.students.find((v: any) => v.id === studentStatus.id)
        if(student){
            let details = student.displayInfo()
            console.log(details)
        }else{
            console.log("Student not found")
        }
   }
   enrollStudent(name: string, course: string, feesPaid: number){
       const id = Student.generatePaddedId()
       const newStudent: any = new Student(id, name, course, feesPaid, this.courseFee)
       this.students.push(newStudent)
       Student.incrementCounter()
       console.log(`${name} you are succesfully enrolled with ID ${id} in ${course} course `)
   }
   
   async start(){
    let exitProgram = false
    while(!exitProgram){
        console.log("Welcome to Student Management system")

       let choicePrompt = await inquirer.prompt([
           {
               type: "list",
               name: "Action",
               message: "Select an option",
               choices: ["Enroll", "Display all students", "Display Student Status","Pay Tution fee", "exit"]
           }
       ])
       switch(choicePrompt.Action){
           case "Display all students":
               this.displayAllStudents()
           break;
           case "Display Student Status":
               await this.displayStudentStatus()
               break;
           case "Enroll":
               await this.promptAddStudent()  
               break;
            case "Pay Tution fee":
                await this.tutionFee()
                break;
           case "exit":
               console.log("Exiting...") 
               exitProgram = true

               break; 
       }
    }  
   }
   async promptAddStudent(){
       let answers = await inquirer.prompt([
           {
               type: "input",
               name: "name",
               message: "Enter your Name"
           },
           {
               type: "list",
               name: "course",
               message: "Select Course",
               choices: this.courses
           }
       ])
           let enrollingCourse = this.enrollStudent(answers.name, answers.course, 0)
           return enrollingCourse
   }
   async tutionFee(){
       let answer = await inquirer.prompt([
           {
               type: "input",
               name: "id",
               message: "Enter student ID"
           },
           {
                type: "list",
                name: "Method",
                message: "Select Deposite Method",
                choices: ["JazzCash", "EasyPaisa", "Bank"]
           },
           {
               type: "input",
               name: "deposite",
               message: "Enter amount to deposite"
           }
       ])
           let student: any = this.students.find((s: any) => s.id == parseInt(answer.id))
           if(student){
               student.tutionFee(parseInt(answer.deposite))
           }else{
               console.log("Student not found")
           }
       
   }
   
}
let sms = new StudentManagementSystem()
sms.start()
