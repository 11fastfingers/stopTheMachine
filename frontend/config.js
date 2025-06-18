let BASE_URL; 
if (process.env.NODE_ENV === "production") {
    BASE_URL = "https://stopthemachine.org"; 
}
else {
    BASE_URL = "http://localhost:3000"; 
}

export {BASE_URL}; 