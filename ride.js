
const fs = require('fs');
const path = require('path');
let example_file_path = 'a_example.in';


//question files
let b_file_path = 'b_should_be_easy.in';
const example_file = path.join(__dirname,b_file_path);
const c_no_hurry = 'c_no_hurry.in';
const d_metropolis = 'd_metropolis.in';
const e_high_bonus = 'e_high_bonus.in';

//answer files
const a_example_answer_file = 'a_example_answer.in';
const b_file_answer_path = 'b_should_be_easy_answer.in';
const c_no_hurry_answer = 'c_no_hurry_input_answer.in';
const d_metropolis_answer = 'd_metropolis_answer.in';
const e_high_bonus_answer = 'e_high_bonus_answer.in';


const questions = [
  example_file_path,b_file_path, c_no_hurry,d_metropolis,e_high_bonus
];

const answers = [
  a_example_answer_file,b_file_answer_path,c_no_hurry_answer,d_metropolis_answer,e_high_bonus_answer
];


function getRides(file){
  return fs.readFileSync(file,{encoding : 'utf-8'});
}

function parseRide(rides_string){
  let parsed = rides_string.split('\n');
  //remove the last empty line
  if(parsed[parsed.length - 1].length == 0){
    parsed.pop();
  }

  let header = parsed[0].split(' ');
  let data =  {
    grid: [header[0],header[1]],
    number_of_vehicles: header[2],
    number_of_rides: header[3],
    bonus_per_ride: header[4],
    number_of_steps: header[5]
  };

  
  parsed.shift();

  data.rides = parsed.map( (element,i) => {
    return parse(element,i);
  });

  function parse(ride,id){
    let _ride = ride.split(' ');
    let data = {
      _id : id,
      start_point: [_ride[0],_ride[1]],
      end_point: [_ride[2],_ride[3]],
      earliest_start: _ride[4],
      latest_finish: _ride[5]
    }
    return data;
  }
  return data;
}

function calculate_distance(start_point, end_point){
  return Math.abs(start_point[0] - end_point[0]) + Math.abs(start_point[1] - end_point[1]) ;
}

function assignRidesToVehicles(rides,vehicles){
  let assignment = vehicles;
  // let _rides = orderRidesByDistance(rides);
  
  for(i = 0; i < rides.length; i++){
    //assign rides
    if(vehicles[i] !== undefined){
      assignment[i].push(rides[i]);
    } else{
      //final position of vehicle 0 and vehicle 1
      let modul = i % assignment.length;
      if(modul !== 0){
        assignment[modul-1].push(rides[i]);
      } else{
        assignment[assignment.length-1].push(rides[i]);
      }
    }
  }
  return assignment;
}

function orderRidesByDistance(rides){
  return rides.sort( (first, next) =>{
    return calculate_distance([0,0],first.start_point) 
      - calculate_distance([0,0],next.start_point);
  });
}

function createVehicles(number_of_vehicles){
  let vehicles = new Array(number_of_vehicles);

  for( i = 0; i < number_of_vehicles; i++){
    vehicles[i] = [];  
  }
  return vehicles;
}

function createAssignmentFile(assignment,output){
  let content = '';
  for( i = 0; i < assignment.length; i++){
    if(content.length !== 0){
      content += '\n';
    }
    content += `${assignment[i].length}`;
    for( j = 0; j < assignment[i].length; j++){
      content += ` ${assignment[i][j]._id}`;
    }
  }
  
 return fs.writeFileSync(output,content,(err) => {
    if(err){
      return false;
    }
    return true;
  });
  
}


//solve for all the questions
questions.map( (question,i) => {
  
let problem = parseRide(getRides(question));

let assignment = assignRidesToVehicles(problem.rides,createVehicles(problem.number_of_vehicles));

createAssignmentFile(assignment,answers[i]);
});


