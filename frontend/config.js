let BASE_URL; 
if (process.env.NODE_ENV === "production") {
    BASE_URL = "https://stop-the-machine.onrender.com/"; 
}
else {
    BASE_URL = "http://localhost:5173"; 
}

export default {BASE_URL}; 