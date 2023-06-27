export default function EventCode(title){
    let firstSec = title.slice(0, 2).toUpperCase(); 
    let secondSec = Math.floor(Math.random() * 1000).toString();
    console.log(secondSec)
    let size = secondSec.length
    for (let i = size; i < 4; i++){
      secondSec = '0' + secondSec; 
      
    }
    console.log(firstSec + secondSec); 
    return firstSec+secondSec
}