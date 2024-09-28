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

## Overview
This project implements a RESTful API designed for managing hotel room service requests. The API allows hotel staff to create, update, retrieve, and delete service requests, ensuring that urgent requests are prioritized to enhance guest satisfaction and operational efficiency.

## Table of Contents
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Data Storage](#data-storage)
- [Approach Explanation](#approach-explanation)
- [How to Test](#how-to-test)

## Technologies Used
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building the API.
- **TypeScript**: Typed superset of JavaScript for better development experience.
- **Async-Lock**: Library for managing concurrent access to resources.
- **JSON**: Data format for storing room service requests.

## API Endpoints
- **POST /requests**: Create a new service request.
- **GET /requests**: Retrieve all service requests, sorted by priority.
- **GET /requests/:id**: Retrieve a specific service request by ID.
- **PUT /requests/:id**: Update an existing service request's details or priority.
- **DELETE /requests/:id**: Remove a completed or canceled service request.
- **POST /requests/:id/complete**: Mark a service request as completed.

## Data Storage
Service requests are stored in a JSON file (`requests.json`) located in the `data` directory. The API reads from and writes to this file to manage service requests temporarily.

## Approach Explanation
1. **Express Server Setup**: The API is built using Express.js, which provides a simple way to create a web server and define routes for the API.

2. **TypeScript for Type Safety**: TypeScript is used to define interfaces, ensuring that the structure of room service requests is consistent throughout the application.

3. **JSON File Handling**: 
   - **Data Reading and Writing**: The API reads and writes to a JSON file using synchronous file operations. This is facilitated by functions (`readFile` and `writeFile`) that handle file access and JSON parsing/stringification.
   - **Concurrency Management**: To prevent issues arising from concurrent access, the `AsyncLock` library is used. It ensures that only one operation can read or write to the file at any time, thus avoiding data corruption.

4. **CRUD Operations**: Each API endpoint corresponds to a CRUD operation:
   - **Create**: A new service request is created with a `POST` request, and the status is set to 'received'.
   - **Read**: Service requests can be retrieved individually or as a sorted list based on priority.
   - **Update**: Existing requests can be updated using a `PUT` request.
   - **Delete**: Completed or canceled requests can be deleted from the system.
   - **Complete**: A specific request can be marked as completed.

5. **Error Handling**: Each endpoint has basic error handling to respond with appropriate status codes and messages if something goes wrong during the processing of requests.

## How to Test
You can test the API using tools like Postman or cURL. Here are some example requests:

#### Add a New Request:
```bash
curl -X POST http://localhost:3000/requests \
-H "Content-Type: application/json" \
-d '{
  "id": "1",
  "guestName": "Alice Johnson",
  "roomNumber": 101,
  "requestDetails": "Extra towels and toiletries",
  "priority": 1,
  "status": "received"
}'
```
#### POST Another Service Request:
```bash
curl -X POST http://localhost:3000/requests \
-H "Content-Type: application/json" \
-d '{
  "id": "2",
  "guestName": "Bob Smith",
  "roomNumber": 102,
  "requestDetails": "Room service for dinner",
  "priority": 2,
  "status": "received"
}'
```
#### POST a High-Priority Service Request:
```bash
curl -X POST http://localhost:3000/requests \
-H "Content-Type: application/json" \
-d '{
  "id": "3",
  "guestName": "Catherine Green",
  "roomNumber": 103,
  "requestDetails": "Medical assistance needed",
  "priority": 0,
  "status": "received"
}'
```
#### POST Another Service Request:
```bash
curl -X POST http://localhost:3000/requests \
-H "Content-Type: application/json" \
-d '{
  "id": "4",
  "guestName": "David Brown",
  "roomNumber": 104,
  "requestDetails": "Complimentary breakfast",
  "priority": 3,
  "status": "received"
}'
```
#### GET All Service Requests:
```bash
curl -X GET http://localhost:3000/requests
```
#### GET a Specific Service Request:
```bash
curl -X GET http://localhost:3000/requests/request_1
```
#### PUT to Update a Service Request:
```bash
curl -X PUT http://localhost:3000/requests/request_2 \
-H "Content-Type: application/json" \
-d '{
  "guestName": "Bob Smith",
  "roomNumber": 102,
  "requestDetails": "Room service for dinner with dessert",
  "priority": 2,
  "status": "in progress"
}'
```
#### DELETE a Service Request:
```bash
curl -X DELETE http://localhost:3000/requests/request_4
```
#### POST to Complete a Service Request:
```bash
curl -X POST http://localhost:3000/requests/request_1/complete
```

### Screenshorts of outputs:
- For Add a New Request, POST Another Service Request, POST a High-Priority Service Request, POST Another Service Request
![alt text](</question-2/screenshots/Screenshot from 2024-09-28 05-45-32.png>)

- For GET All Service Requests
![alt text](</question-2/screenshots/Screenshot from 2024-09-28 05-45-54.png>)

- for GET a Specific Service Request
![alt text](</question-2/screenshots/Screenshot from 2024-09-28 05-47-08.png>)

- for PUT to Update a Service Request
![alt text](</question-2/screenshots/Screenshot from 2024-09-28 05-48-42.png>)

- for DELETE a Service Request, POST to Complete a Service Request
![alt text](</question-2/screenshots/Screenshot from 2024-09-28 05-49-35.png>)

- requests.json
![alt text](/question-2/screenshots/image.png)