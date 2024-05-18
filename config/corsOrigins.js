const whiteList = [
    'https://online-shop.maciejkloda.pl',
    'http://127.0.0.1:3000',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, origin)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;