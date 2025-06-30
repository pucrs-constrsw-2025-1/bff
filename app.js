const express = require("express");
const cors = require("cors");
const actuator = require('express-actuator');
const promClient = require('prom-client');

const app = express();
const port = process.env.BFF_INTERNAL_API_PORT;

const { checkLoggedIn } = require("./middleware/authMiddleware");
const {createProxyMiddleware} = require("http-proxy-middleware");

// Prometheus metrics
const register = promClient.register;
const collectDefaultMetrics = promClient.collectDefaultMetrics;

// Collect default metrics
collectDefaultMetrics({ register });

// Configure middleware first
app.use(cors({
    origin: `${process.env.FRONTEND_EXTERNAL_PROTOCOL}://${process.env.FRONTEND_EXTERNAL_HOST}:${process.env.FRONTEND_EXTERNAL_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

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

// Configure Actuator
const actuatorOptions = {
    basePath: '/actuator',
    infoGitMode: 'simple',
    infoBuildOptions: {
        name: 'BFF Service',
        version: '1.0.0',
        description: 'Backend for Frontend (BFF) Service for ConstrSW',
        contact: {
            name: 'ConstrSW Team'
        }
    },
    customEndpoints: [
        {
            id: 'services',
            controller: (req, res) => {
                const services = {
                    classes: `${process.env.CLASSES_INTERNAL_PROTOCOL}://${process.env.CLASSES_INTERNAL_HOST}:${process.env.CLASSES_INTERNAL_API_PORT}`,
                    courses: `${process.env.COURSES_INTERNAL_PROTOCOL}://${process.env.COURSES_INTERNAL_HOST}:${process.env.COURSES_INTERNAL_API_PORT}`,
                    lessons: `${process.env.LESSONS_INTERNAL_PROTOCOL}://${process.env.LESSONS_INTERNAL_HOST}:${process.env.LESSONS_INTERNAL_API_PORT}`,
                    professors: `${process.env.PROFESSORS_INTERNAL_PROTOCOL}://${process.env.PROFESSORS_INTERNAL_HOST}:${process.env.PROFESSORS_INTERNAL_API_PORT}`,
                    reservations: `${process.env.RESERVATIONS_INTERNAL_PROTOCOL}://${process.env.RESERVATIONS_INTERNAL_HOST}:${process.env.RESERVATIONS_INTERNAL_API_PORT}`,
                    resources: `${process.env.RESOURCES_INTERNAL_PROTOCOL}://${process.env.RESOURCES_INTERNAL_HOST}:${process.env.RESOURCES_INTERNAL_API_PORT}`,
                    rooms: `${process.env.ROOMS_INTERNAL_PROTOCOL}://${process.env.ROOMS_INTERNAL_HOST}:${process.env.ROOMS_INTERNAL_API_PORT}`,
                    students: `${process.env.STUDENTS_INTERNAL_PROTOCOL}://${process.env.STUDENTS_INTERNAL_HOST}:${process.env.STUDENTS_INTERNAL_API_PORT}`
                };
                res.json({
                    status: 'UP',
                    services: services
                });
            }
        }
    ]
};

// Initialize Actuator
app.use(actuator(actuatorOptions));

// Prometheus metrics endpoint
app.get('/actuator/prometheus', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});

// Keep the legacy health endpoint for backward compatibility
app.get("/health", (req, res) => {
	res.status(200).send("OK");
});

app.listen(port);
