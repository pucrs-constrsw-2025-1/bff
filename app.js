const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.BFF_INTERNAL_API_PORT;

const { checkLoggedIn } = require("./middleware/authMiddleware");
const {createProxyMiddleware} = require("http-proxy-middleware");

// Configure middleware first
app.use(cors({
    origin: `${process.env.FRONTEND_EXTERNAL_PROTOCOL}://${process.env.FRONTEND_EXTERNAL_HOST}:${process.env.FRONTEND_EXTERNAL_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure the proxy middleware
const createServiceProxy = ({serviceName, serviceUrl}) => (createProxyMiddleware({
    target: serviceUrl, // The URL of your external service
    changeOrigin: true, // Recommended for virtual hosted sites, changes the host header to the target URL
    pathRewrite: {
        [`^/${serviceName}`]: "", // Rewrite the path: remove "/${serviceName}" from the beginning
    },
}));

// Use the proxy middleware for any requests starting with "/classes"
app.use("/classes", checkLoggedIn, createServiceProxy({serviceName: "classes", serviceUrl: `${process.env.CLASSES_INTERNAL_PROTOCOL}://${process.env.CLASSES_INTERNAL_HOST}:${process.env.CLASSES_INTERNAL_API_PORT}`}));
app.use("/courses", checkLoggedIn, createServiceProxy({serviceName: "courses", serviceUrl: `${process.env.COURSES_INTERNAL_PROTOCOL}://${process.env.COURSES_INTERNAL_HOST}:${process.env.COURSES_INTERNAL_API_PORT}`}));
app.use("/lessons", checkLoggedIn, createServiceProxy({serviceName: "lessons", serviceUrl: `${process.env.LESSONS_INTERNAL_PROTOCOL}://${process.env.LESSONS_INTERNAL_HOST}:${process.env.LESSONS_INTERNAL_API_PORT}`}));
app.use("/professors", checkLoggedIn, createServiceProxy({serviceName: "professors", serviceUrl: `${process.env.PROFESSORS_INTERNAL_PROTOCOL}://${process.env.PROFESSORS_INTERNAL_HOST}:${process.env.PROFESSORS_INTERNAL_API_PORT}`}));
app.use("/reservations", checkLoggedIn, createServiceProxy({serviceName: "reservations", serviceUrl: `${process.env.RESERVATIONS_INTERNAL_PROTOCOL}://${process.env.RESERVATIONS_INTERNAL_HOST}:${process.env.RESERVATIONS_INTERNAL_API_PORT}`}));
app.use("/resources", checkLoggedIn, createServiceProxy({serviceName: "resources", serviceUrl: `${process.env.RESOURCES_INTERNAL_PROTOCOL}://${process.env.RESOURCES_INTERNAL_HOST}:${process.env.RESOURCES_INTERNAL_API_PORT}`}));
app.use("/rooms", checkLoggedIn, createServiceProxy({serviceName: "rooms", serviceUrl: `${process.env.ROOMS_INTERNAL_PROTOCOL}://${process.env.ROOMS_INTERNAL_HOST}:${process.env.ROOMS_INTERNAL_API_PORT}`}));
app.use("/students", checkLoggedIn, createServiceProxy({serviceName: "students", serviceUrl: `${process.env.STUDENTS_INTERNAL_PROTOCOL}://${process.env.STUDENTS_INTERNAL_HOST}:${process.env.STUDENTS_INTERNAL_API_PORT}`}));

app.get("/health", (req, res) => {
	res.status(200).send("OK");
});

app.listen(port);
