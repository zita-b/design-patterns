//creational

//example 1:
function Developer(name) {
  this.name = name
  this.type = "Developer"
}

function Tester(name) {
  this.name = name
  this.type = "Tester"
}

function EmployeeFactory() {
  this.create = (name, type) => {
    switch(type) {
      case 1:
        return new Developer(name)
      case 2:
        return new Tester(name)
    }
  }
}

function say() {
  console.log("Hi, I am " + this.name + " and I am a " + this.type)
}

const employee = new EmployeeFactory()
const employees = []

employees.push(employee.create("Patrick", 1))
employees.push(employee.create("Ann", 2))

employees.forEach(emp => {
  say.call(emp)
})

//example 2:
//see index.html