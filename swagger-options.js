export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My Online Shop API",
            version: "1.0.0",
            description: "API documentation for Online Shop backend",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3001}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};
