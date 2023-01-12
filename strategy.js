//behavioral

//example 1:
function Fedex() {
  this.calculate = package => {
    return (package.weigth * 0.8 + 3.45).toFixed(2)
  }
}

function UPS() {
  this.calculate = package => {
    return (package.weigth * 1.2 + 1.56).toFixed(2)
  }
}

function USPS() {
  this.calculate = package => {
    return (package.weigth * 1.5 + 4.5).toFixed(2)
  }
}

function Shipping() {
  this.company = ""
  this.setStrategy = (company) => {
    this.company = company
  }
  this.calculate = package => {
    return this.company.calculate(package)
  }
}

const fedex = new Fedex()
const ups = new UPS()
const usps = new USPS()
const package = { from: 'Alabama', to: 'Georgia', weigth: 1.56 }

const shipping = new Shipping()

shipping.setStrategy(fedex)
console.log("Fedex: " + shipping.calculate(package))

shipping.setStrategy(ups)
console.log("UPS: " + shipping.calculate(package))

shipping.setStrategy(usps)
console.log("USPS: " + shipping.calculate(package))

//example 2:
//see strategy2.js