# Calry Internship Assignment

## Overview

This repository contains the implementation for the Calry Internship assignment, which includes:

1. **Workspace Management Function**: A function that helps a workspace management app schedule meetings by merging overlapping or consecutive booking times.
2. **Hotel Room Service Request Management System**: A system built with TypeScript, Node.js, and Express that allows users to create, read, update, and delete room service requests.


## Question-1 (Workspace Management Function): 

### Approach Explanation

The `optimizeBookings` function optimizes meeting room bookings by merging overlapping or consecutive booking times. The approach involves the following steps:

1. **Sorting the Bookings**:
   - The input bookings are sorted based on their start times. If two bookings start at the same time, they are sorted by their end times. This ensures that the bookings are processed in the correct order, which is essential for merging.

2. **Merging Overlapping Bookings**:
   - A pointer, `left`, is initialized to keep track of the last merged booking.
   - The function iterates through the sorted bookings starting from the second booking. For each booking:
     - If the start time of the current booking is less than or equal to the end time of the last merged booking (`bookings[left][1]`), it indicates an overlap or direct continuity. The end time of the last merged booking is updated to the maximum end time between the two overlapping bookings.
     - If there’s no overlap, the current booking is added as a new merged booking by incrementing the `left` pointer.

3. **Returning the Result**:
   - Finally, the function returns the merged bookings by slicing the original bookings array from the start to `left + 1`, which contains all the optimized bookings.

This approach ensures that all overlapping and consecutive bookings are efficiently merged into a minimized list, providing an optimized schedule for meeting room usage.

### Time complexity:
- The time complexity of the `optimizeBookings` function is **O(n log n)**, where **n** is the number of bookings. This is primarily due to the sorting step.
- The merging step has a time complexity of **O(n)** since it involves a single pass through the sorted bookings.
- The `splice` operation is O(n) in the worst case.
- Therefore, the overall time complexity remains dominated by the sorting operation, resulting in **O(n log n + n + n)** ~ **O(n log n)**.
- Total Space Complexity is **O(1)**


### Alternative Approach:
Instead of using `splice`, we can maintain an additional array to store the merged bookings. The steps are as follows:

1. **Sorting**: Sort the input bookings by their start and end times.
2. **Merging**: Iterate through the sorted bookings. If the current booking overlaps with the last added booking in the new array, update the end time. If not, add the current booking to the new array.
3. **Output**: Return the new array containing the optimized bookings.

### Time Complexity

The time complexity of the `optimizeBookings` function is **O(n log n)**, where **n** is the number of bookings. This is primarily due to the sorting step.
- The merging step has a time complexity of **O(n)** since it involves a single pass through the sorted bookings.
- Total time complexity is **O(n logn + n)**
- Total Space complexity of **O(n)** for the additional array.


**Note**: The first algorithm is implemented because it requires less memory than the second approach and efficiently handles a list of bookings. It is a better design to work for up to 1,000 bookings to simulate a busy office environment.

### Requirments to run the algorithm:
- Make sure you have Node.js installed
- Install TypeScript globally if you haven't already: \
    npm install -g typescript
- Install ts-node globally to execute TypeScript files directly:\
npm install -g ts-node 
- to run the file \
ts-node question1.ts

### Screenshots of the input request and output response:

![alt text](/question-1/image.png)


## Question-2 (Hotel Room Service Request Management System): 