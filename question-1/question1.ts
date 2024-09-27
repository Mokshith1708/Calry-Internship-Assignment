function optimizeBookings (bookings: number[][]): number[][] {
  bookings.sort((a, b) => {
    if (a[0] == b[0]) {
      return a[1] - b[1];
    }
    return a[0] - b[0];
  })

  let left = 0;
  for (let i = 1; i < bookings.length; i++) {
    if (bookings[i][0] <= bookings[left][1]) {
      bookings[left][1] = Math.max(bookings[left][1], bookings[i][1]);
    } else {
      left++;
      bookings[left] = bookings[i];
    }
  }

  return bookings.slice(0, left + 1);
}


console.log("Existing test case:");
let inputBookings1 = [[9, 12], [11, 13], [14, 17], [16, 18]];
console.log("Input 1:", inputBookings1);
console.log("Output 1:", optimizeBookings(inputBookings1));
console.log();
console.log("Test case with consecutive bookings:");
let inputBookings2 = [[9, 12], [12, 14], [14, 15]];
console.log("Input 2:", inputBookings2);
console.log("Output 2:", optimizeBookings(inputBookings2));
console.log();
console.log("Test case with non-overlapping bookings:");
let inputBookings3 = [[8, 9], [10, 11], [12, 13]];
console.log("Input 3:", inputBookings3);
console.log("Output 3:", optimizeBookings(inputBookings3));
console.log();
console.log("Test case with fully overlapping bookings:");
let inputBookings4 = [[10, 20], [12, 15], [14, 18]];
console.log("Input 4:", inputBookings4);
console.log("Output 4:", optimizeBookings(inputBookings4));
console.log();
console.log("Test case with mixed scenarios:");
let inputBookings5 = [[1, 3], [2, 4], [5, 7], [6, 8], [9, 10]];
console.log("Input 5:", inputBookings5);
console.log("Output 5:", optimizeBookings(inputBookings5));
console.log();
console.log("Test case with an empty list:");
let inputBookings6: number[][] = [];
console.log("Input 6:", inputBookings6);
console.log("Output 6:", optimizeBookings(inputBookings6));
console.log();
console.log("Test case with bookings that touch end-to-start:");
let inputBookings7 = [[1, 2], [2, 3], [3, 4]];
console.log("Input 7:", inputBookings7);
console.log("Output 7:", optimizeBookings(inputBookings7));
console.log();
console.log("Test case with random overlapping bookings:");
let inputBookings8 = [[5, 10], [3, 4], [8, 12], [6, 9]];
console.log("Input 8:", inputBookings8);
console.log("Output 8:", optimizeBookings(inputBookings8));
console.log();