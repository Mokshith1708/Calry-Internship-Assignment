"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const async_lock_1 = __importDefault(require("async-lock"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
const requestsFilePaths = path_1.default.join(__dirname, '../data', 'requests.json');
const lock = new async_lock_1.default();
const readFile = () => {
    return new Promise((resolve, reject) => {
        lock.acquire('fileLock', () => {
            try {
                const data = fs_1.default.readFileSync(requestsFilePaths, 'utf8');
                resolve(JSON.parse(data));
            }
            catch (error) {
                reject(error);
            }
        });
    });
};
const writeFile = (requests) => {
    return new Promise((resolve, reject) => {
        lock.acquire('fileLock', () => {
            try {
                fs_1.default.writeFileSync(requestsFilePaths, JSON.stringify(requests, null, 2));
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    });
};
app.get('/', (req, res) => {
    res.send('Welcome to the Hotel Room Service API!');
});
app.post('/requests', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guestName, roomNumber, requestDetails, priority } = req.body;
    try {
        const requests = yield readFile();
        const newRequest = {
            id: `request_${(yield requests).length + 1}`,
            guestName,
            roomNumber,
            requestDetails,
            priority,
            status: 'received'
        };
        (yield requests).push(newRequest);
        writeFile(yield requests);
        res.status(201).json(newRequest);
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing request', error });
    }
}));
app.get('/requests', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield readFile();
        (yield requests).sort((a, b) => a.priority - b.priority);
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing request', error });
    }
}));
app.get('/requests/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield readFile();
        const request = (yield requests).find(r => r.id === req.params.id);
        if (request) {
            res.json(request);
        }
        else {
            res.status(404).json({ message: 'Request not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing request', error });
    }
}));
app.put('/requests/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield readFile();
        const index = (yield requests).findIndex(r => r.id === req.params.id);
        if (index != -1) {
            const updatedReq = Object.assign(Object.assign({}, requests[index]), req.body);
            requests[index] = updatedReq;
            yield writeFile(requests);
            res.json(updatedReq);
        }
        else {
            res.status(404).json({ message: 'Request not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing request', error });
    }
}));
app.delete('/requests/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield readFile();
        const index = (yield requests).findIndex(r => r.id === req.params.id);
        if (index != -1) {
            requests.splice(index, 1);
            yield writeFile(requests);
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: 'Request not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing request', error });
    }
}));
app.post('/requests/:id/complete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield readFile();
        const index = (yield requests).findIndex(r => r.id === req.params.id);
        if (index != -1) {
            requests[index].status = 'completed';
            yield writeFile(requests);
            res.json(requests[index]);
        }
        else {
            res.status(404).json({ message: 'Request not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing request', error });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
