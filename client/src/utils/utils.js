// function to format a number of 1 digit adding one 0 to the beggining
const formatNumber = (number) => {
  return number < 10 ? "0" + number : number.toString();
};

// function to count the number of seats given an airplane type and the status of the seat
const countSeats = (airplane, status) => {
  let count = 0;

  for (const row in airplane) {
    for (const seat in airplane[row]) {
      if (airplane[row][seat] == status) {
        count++;
      }
    }
  }

  return count;
};

const utils = {
  formatNumber,
  countSeats,
};

export default utils;
