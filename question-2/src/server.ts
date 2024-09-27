import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import AsyncLock from 'async-lock'
const app = express()
const PORT = 3000

app.use(bodyParser.json())

const requestsFilePaths = path.join(__dirname, '../data', 'requests.json')

interface HotelRoomServiceRequests {
  id: string
  guestName: string
  roomNumber: number
  requestDetails: string
  priority: number
  status:
    | 'received'
    | 'in progress'
    | 'awaiting confirmation'
    | 'completed'
    | 'canceled'
}

const lock = new AsyncLock()

const readFile = (): Promise<HotelRoomServiceRequests[]> => {
  return new Promise((resolve, reject) => {
    lock.acquire('fileLock', () => {
      try {
        const data = fs.readFileSync(requestsFilePaths, 'utf8')
        resolve(JSON.parse(data))
      } catch (error) {
        reject(error)
      }
    })
  })
}

const writeFile = (requests: HotelRoomServiceRequests[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    lock.acquire('fileLock', () => {
      try {
        fs.writeFileSync(requestsFilePaths, JSON.stringify(requests, null, 2))
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  })
}

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Hotel Room Service API!');
  });
  

app.post('/requests', async (req: Request, res: Response) => {
  const {
    guestName,
    roomNumber,
    requestDetails,
    priority
  }: Omit<HotelRoomServiceRequests, 'id' | 'status'> = req.body
  try {
    const requests = await readFile()
    const newRequest: HotelRoomServiceRequests = {
      id: `request_${(await requests).length + 1}`,
      guestName,
      roomNumber,
      requestDetails,
      priority,
      status: 'received'
    }
    ;(await requests).push(newRequest)
    writeFile(await requests)
    res.status(201).json(newRequest)
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error })
  }
})

app.get('/requests', async (req: Request, res: Response) => {
  try {
    const requests = await readFile()
    ;(await requests).sort((a, b) => a.priority - b.priority)
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error })
  }
})

app.get('/requests/:id', async (req: Request, res: Response) => {
  try {
    const requests = await readFile()
    const request = (await requests).find(r => r.id === req.params.id)
    if (request) {
      res.json(request)
    } else {
      res.status(404).json({ message: 'Request not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error })
  }
})

app.put('/requests/:id', async (req: Request, res: Response) => {
  try {
    const requests = await readFile()
    const index = (await requests).findIndex(r => r.id === req.params.id)
    if (index != -1) {
      const updatedReq = { ...requests[index], ...req.body }
      requests[index] = updatedReq
      await writeFile(requests)
      res.json(updatedReq)
    } else {
      res.status(404).json({ message: 'Request not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error })
  }
})

app.delete('/requests/:id', async (req: Request, res: Response) => {
  try {
    const requests = await readFile()
    const index = (await requests).findIndex(r => r.id === req.params.id)
    if (index != -1) {
      requests.splice(index, 1)
      await writeFile(requests)
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Request not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error })
  }
})

app.post('/requests/:id/complete', async (req: Request, res: Response) => {
  try {
    const requests = await readFile()
    const index = (await requests).findIndex(r => r.id === req.params.id)
    if (index != -1) {
      requests[index].status = 'completed'
      await writeFile(requests)
      res.json(requests[index])
    } else {
      res.status(404).json({ message: 'Request not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error })
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
